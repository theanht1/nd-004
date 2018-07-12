$(document).ready(function(){
    // Active select input of the css framework
    $('select').formSelect();

    // Logout function
    var logoutEl = $('#logout')[0]
    if (logoutEl) {
        logoutEl.addEventListener('click', function() {
            $.ajax({
                type: 'POST',
                url: '/gdisconnect',
                processData: false,
                contentType: 'application/octet-stream; charset=utf-8',
                success: function() {
                    window.location.reload();
                },
                error: function(err) {
                    if (err.responseText.length > 0) {
                        var error = JSON.parse(err.responseText);
                        if (error && error.error) {
                            M.toast({
                                html: error.error,
                                classes: 'flash-error',
                                displayLength: 5000,
                            });
                        }
                    }
                },
            });
        });
    }
});

// Callback for google sign in
function signInCallback(authResult) {
    if (authResult['code']) {
        // Hide the sign-in button now that the user is authorized
        $('#signinButton').attr('style', 'display: none');
        // Send the one-time-use code to the server
        $.ajax({
            type: 'POST',
            url: '/gconnect?state={{STATE}}',
            processData: false,
            data: authResult['code'],
            contentType: 'application/octet-stream; charset=utf-8',
            success: function(result) {
                // Handle or verify the server response if necessary.
                if (result) {
                    $('#result').html('Login Successful!</br>Redirecting...')
                    setTimeout(function() {
                        window.location.href = "/";
                    }, 1000);
                } else if (authResult['error']) {
                    console.log('There was an error: ' + authResult['error']);
                } else {
                    $('#result').html('Failed to make a server-side call. Check your configuration and console.');
                }
            }});
    }
}