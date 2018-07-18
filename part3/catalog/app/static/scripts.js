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
        // Send the one-time-use code to the server
        $.ajax({
            type: 'POST',
            url: '/gconnect',
            processData: false,
            data: authResult['code'],
            contentType: 'application/octet-stream; charset=utf-8',
            success: function(result) {
                if (result) {
                    window.location.href = "/";
                }
            },
            error: function(xhr, ajaxOptions, thrownError) {
                var error;
                try {
                    error = JSON.parse(xhr.responseText).error;
                } catch (e) {
                    error = 'Something went wrong';
                }
                M.toast({
                    html: error,
                    classes: 'flash-error',
                    displayLength: 5000,
                });
            }
        });
    }
}