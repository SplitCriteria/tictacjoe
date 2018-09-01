// Alerts the user if a target user, password, and confirm password fields
// are not filled out appropriately and returns false. Otherwise returns true.
function check_user_registration(user, password, confirm_password) {
    if (document.getElementById(user).value == "") {
        alert("Please input a username");
        return false;
    }
    if (document.getElementById(password).value == "") {
        alert("Please specify a password");
        return false;
    }
    if (document.getElementById(password).value != document.getElementById(confirm_password).value) {
        alert("Your passwords do not match");
        return false;
    }
    return true;
}

// Autosubmits a form
function autosubmit(target) {
    var form = document.getElementById(target);
    form.submit();
}
