from media import Movie
import fresh_tomatoes as ft

movies = [
	Movie(
		'Avengers: Infinity War',
		'https://upload.wikimedia.org/wikipedia/en/4/4d/Avengers_Infinity_War_poster.jpg',
		'https://www.youtube.com/watch?v=6ZfuNTqbHE8',
	),
	Movie(
		'Sherlock',
		'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRspC3OJZCxA8GFl9AiCJmUEogic8exynhnrlLyyvuHY6gKdRKn',
		'https://www.youtube.com/watch?v=xK7S9mrFWL4',
	),
	Movie(
		'The Imitation Game',
		'https://cameronmoviesandtv.files.wordpress.com/2015/04/the-imitation-game.jpg?w=1400',
		'https://www.youtube.com/watch?v=nuPZUUED5uk',
	),
]

ft.open_movies_page(movies)