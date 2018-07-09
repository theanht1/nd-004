#!/usr/bin/env python
#
# tournament.py -- implementation of a Swiss-system tournament
#

import psycopg2


def connect():
    """Connect to the PostgreSQL database.  Returns a database connection."""
    return psycopg2.connect("dbname=tournament")

def execSql(cmd, vars=None):
    db = connect()
    cursor = db.cursor()
    result = cursor.execute(cmd, vars)
    db.commit()
    db.close()

    return result

def fetch(cmd):
    db = connect()
    cursor = db.cursor()
    cursor.execute(cmd)
    result = cursor.fetchall()
    db.close()

    return result

def deleteMatches():
    """Remove all the match records from the database."""
    return execSql("DELETE FROM matches")


def deletePlayers():
    """Remove all the player records from the database."""
    return execSql("DELETE FROM players")


def countPlayers():
    """Returns the number of players currently registered."""
    return fetch("SELECT COUNT(*) from players")[0][0]


def registerPlayer(name):
    """Adds a player to the tournament database.

    The database assigns a unique serial id number for the player.  (This
    should be handled by your SQL database schema, not in your Python code.)

    Args:
      name: the player's full name (need not be unique).
    """
    return execSql("INSERT INTO players (name) VALUES (%s)", (name,))


def playerStandings():
    """Returns a list of the players and their win records, sorted by wins.

    The first entry in the list should be the player in first place, or a player
    tied for first place if there is currently a tie.

    Returns:
      A list of tuples, each of which contains (id, name, wins, matches):
        id: the player's unique id (assigned by the database)
        name: the player's full name (as registered)
        wins: the number of matches the player has won
        matches: the number of matches the player has played
    """
    return fetch("""SELECT p.id, p.name,
                        COUNT(p.id) FILTER (WHERE p.id = m.winner) AS wins,
                        COUNT(m.*) AS matches
                    FROM players p
                        LEFT JOIN matches m ON p.id = m.player1 OR p.id = m.player2
                    GROUP BY p.id
                    ORDER BY wins DESC
                 """)


def reportMatch(winner, loser):
    """Records the outcome of a single match between two players.

    Args:
      winner:  the id number of the player who won
      loser:  the id number of the player who lost
    """
    return execSql("INSERT INTO matches VALUES (%s, %s, %s)",
                    (winner, loser, winner))


def swissPairings():
    """Returns a list of pairs of players for the next round of a match.

    Assuming that there are an even number of players registered, each player
    appears exactly once in the pairings.  Each player is paired with another
    player with an equal or nearly-equal win record, that is, a player adjacent
    to him or her in the standings.

    Returns:
      A list of tuples, each of which contains (id1, name1, id2, name2)
        id1: the first player's unique id
        name1: the first player's name
        id2: the second player's unique id
        name2: the second player's name
    """

    players = playerStandings()
    pairs = []
    for index in range(len(players) / 2):
        p1, p2 = players[index * 2 : index * 2 + 2]
        pairs.append((p1[0], p1[1], p2[0], p2[1]))

    return pairs
