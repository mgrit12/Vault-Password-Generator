// First file Script



// Check Json File is uploaded or not
$('input[type="file"]').change(function (e) {
    var fileName = e.target.files[0].name;
    $('.custom-file-label').html(fileName);
    if (!fileName.endsWith('.json')) {
        alert("please uplod json format file");
        $('.custom-file-label').html("");
    }
});

//After Uploading Encryted file, decpryt it to allow user to log in

function decryptAndValidate() {
    const fileInput = document.getElementById('fileInputDecrypt');
    const file = fileInput.files[0];
    const fileName = file.name;
    console.log(fileName);
    if (!file) {
        alert("Please select an encrypted JSON file to upload.");
        return;
    }
    // Check if the file extension is not .json
    if (!fileName.endsWith('.json')) {

        alert('Please upload a .json file.');
        return;
    }


    const decryptionKey = document.getElementById('encryptionKeyDecrypt').value;
    if (decryptionKey.trim() === '') {
        alert('Please provide a decryption key.');
        return;
    }
    const masterUsername = document.getElementById('masterUsername').value;
    const masterPassword = document.getElementById('masterPassword').value;

    const reader = new FileReader();
    reader.onload = function (event) {
        const encryptedData = event.target.result;
        try {
            const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, decryptionKey);
            const decryptedData = decryptedBytes.toString(CryptoJS.enc.Utf8);
            if (!decryptedData) {
                throw new Error("Decryption failed");
            }

            // Parse JSON and validate user credentials
            const jsonData = JSON.parse(decryptedData);
            var userJSON = JSON.stringify(jsonData);
            console.log(userJSON);
            // Store JSON string in sessionStorage under key 'currentUser'
            sessionStorage.setItem('currentUser', userJSON);

            // Array to store user data

            Object.keys(jsonData).forEach(key => {
                var domain = masterUsername.replace(/.*@/, "").replace(/\..*/, "");

                Object.keys(jsonData).forEach(key => {
                    const keysArray = Object.values(jsonData)[0];
                    if (domain in keysArray) {
                        var username = jsonData[key][domain].Username;
                        var password = jsonData[key][domain].password;
                        if (username == masterUsername && password === masterPassword) {
                            var session_username = Object.keys(jsonData)[0];
                            sessionStorage.setItem("name", session_username);
                            alert("Login successful!");
                            window.location.href = "detials.html";
                        } else {

                            alert("JSON file is not decrypted.");
                        }
                    }
                    else {
                        alert("Account Does not exist");
                    }
                });
            }
            );

        } catch (e) {
            alert("Error during decryption: " + e.message);
        }
    };
    reader.readAsText(file);
}



function clear_session() {
    sessionStorage.clear();
    sessionStorage.removeItem("name");
    sessionStorage.removeItem("password");
    sessionStorage.removeItem("currentUser");
    sessionStorage.clear();
    window.location.href = "index.html";
}


//******************Second File Script**********************//
var user_session = sessionStorage.getItem("name");
$('.username').text(user_session);
$(document).ready(function () {
    user_details = sessionStorage.getItem("currentUser");
    var currentUser = JSON.parse(user_details);
    var obj_value = Object.keys(currentUser[user_session]);
});
function search_user_detail() {
    const inputString = $("#inlineFormInputGroupUsername").val();
    user_details = sessionStorage.getItem("currentUser");
    var currentUser = JSON.parse(user_details);

    var obj_value = Object.keys(currentUser[user_session]);
    if (obj_value.includes(inputString)) {
        Object.keys(currentUser).forEach(key => {
            const keysArray = Object.values(currentUser)[0];
            console.log(keysArray[inputString]);
            $("#account_name").text(inputString); //User_name_field
            $("#user_name").text(keysArray[inputString].Username); //User_name_field
            $("#user_password").text(keysArray[inputString].password); //User_name_field user_password
            sessionStorage.setItem('password', keysArray[inputString].password);
            $("#pass_strength").text(keysArray[inputString].passwordStrengt); //User_name_field user_password
            $("#note").text(keysArray[inputString].extraInfo); //User_name_field user_password
            $("#account_date").text(keysArray[inputString].passwordChangeDate); //User_name_field user_password
            var password = keysArray[inputString].password;
            var elm = document.getElementById("qr-code").firstElementChild;
            console.log("elm", elm);
            elm.setAttribute("src", "imgs/qr.jpg");
        });

        // $("#account_name").text(Object.values(currentUser[user_session][inputString]));
    } else {
        alert("no account found");
    }
}


$("#generateQR").click(function () {
    if ($('#account_name').is(':empty')) {
        alert("Please Select Username first");
    } else {
        generateQR();
    }

});

function generateQR() {
    // document.getElementById("myImage").style.display = "none";
    const inputString = $("#inlineFormInputGroupUsername").val();
    user_details = sessionStorage.getItem("currentUser");
    var currentUser = JSON.parse(user_details);

    var obj_value = Object.keys(currentUser[user_session]);
    if (obj_value.includes(inputString)) {
        Object.keys(currentUser).forEach(key => {
            const keysArray = Object.values(currentUser)[0];
            var password = keysArray[inputString].password;

            console.log(password);
            if (password.trim() === '') {
                alert('Please enter a password.');
                return;
            }
            // Clear previous QR code
            document.getElementById('qr-code').innerHTML = '';
            // Create QR code instance
            var qr = qrcode(0, 'L');
            qr.addData(password);
            qr.make();
            // Generate QR code image and display it
            var qrImage = qr.createImgTag();
            document.getElementById('qr-code').innerHTML = qrImage;
        });
    }
}

$("#check_strength").click(function () {
    if ($('#account_name').is(':empty')) {
        alert("Please Select Username first");
    } else {
        const inputString = $("#inlineFormInputGroupUsername").val();
        check_strength(inputString);
    }
});

function check_strength(inputString) {
    window.location.href = `check.html?account_name=${inputString}`;
}


//Add new Account
$("#add_account_name").click(function () {
    $("#new_account_name").prop('disabled', true);
    $("#second_part").css("display", "block");
    var account_name = $("#new_account_name").val();
    user_details = sessionStorage.getItem("currentUser");
    var currentUser = JSON.parse(user_details);
    var account_name_exist = Object.keys(currentUser[user_session]);
    console.log(account_name_exist);

    if (account_name_exist.includes(account_name)) {
        alert("Account already Exist");
        $("#second_part").css("display", "none");
        $("#new_account_name").prop('disabled', false);
    } else {
        Object.keys(currentUser).forEach(key => {
            const keysArray = Object.values(currentUser)[0];
            keysArray[account_name] = {};
            console.log(currentUser);

        });
    }
});

//Add new Account Second part Submit
$("#submit_changes").click(function () {
    $("#new_account_name").prop('disabled', true);
    $("#second_part").css("display", "block");
    var account_name = $("#new_account_name").val();
    user_details = sessionStorage.getItem("currentUser");
    var currentUser = JSON.parse(user_details);
    Object.keys(currentUser).forEach(key => {
        const keysArray = Object.values(currentUser)[0];
        keysArray[account_name] = {};
        keysArray[account_name].Username = $("#new_username").val();
        keysArray[account_name].password = $("#new_password").val();
        keysArray[account_name].extraInfo = $("#new_description").val();
        keysArray[account_name].passwordChangeDate = new Date();
        keysArray[account_name].passwordStrengt = 5;
        keysArray[account_name].Application = "Live Account";
        keysArray[account_name].Level = 2;
        keysArray[account_name].PlayMins = 25;
        console.log(currentUser);
        sessionStorage.removeItem("currentUser");
        var userJSON = JSON.stringify(currentUser);
        sessionStorage.setItem("currentUser", userJSON);
        $("#exampleModalCenter .close").click();
        window.location.href = "detials.html";
    });

});

//save account detail in file



//********** Script for file 3************ */

$("#download").click(function () {
    user_details = sessionStorage.getItem("currentUser");
    // var currentUser = JSON.parse(user_details);
    const jsonData = user_details;
    const encryptedData = CryptoJS.AES.encrypt(jsonData, "1").toString();
    downloadFile(encryptedData, "encrypted.json");
});

function downloadFile(data, filename) {
    const blob = new Blob([data], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

//Get user name from Session storage
var user_session = sessionStorage.getItem("name");
$('.username').text(user_session);

//url value 
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const account_name = urlParams.get('account_name')

document.addEventListener('DOMContentLoaded', function () {
    const passwordInput = document.getElementById('password');
    var password = sessionStorage.getItem("password");
    console.log(password);
    $("#password").val(password);

    if ($('#password:text').val().length != 0) {
        var pass = $('#password:text').val();
        generateQRs(pass);
    }


    $("#generate_password").click(function () {
        var genpassword = generateRandomPassword();
        $("#password").val("");
        $("#password").val(genpassword);
        generateQRs(genpassword)
    });

    $("#copy_password").click(function () {
        copyToClipboard();
    });


    $("#back_pages").click(function () {
        window.location.href = "detials.html";
    });


    $("#save_generate_password").click(function () {
        user_details = sessionStorage.getItem("currentUser");
        var currentUser = JSON.parse(user_details);
        Object.keys(currentUser).forEach(key => {
            const keysArray = Object.values(currentUser)[0][account_name];
            keysArray.password = $("#password").val();
            console.log(currentUser);
            sessionStorage.removeItem("currentUser");
            var userJSON = JSON.stringify(currentUser);
            sessionStorage.setItem("currentUser", userJSON);
            alert("Password has been Changed.")
        });
    });

    function copyToClipboard() {
        // Get the input field
        var copyText = document.getElementById("password");

        // Select the text field
        copyText.select();
        copyText.setSelectionRange(0, 99999); // For mobile devices

        // Copy the text inside the input field
        navigator.clipboard.writeText(copyText.value)
            .then(() => {
                alert("Text copied to clipboard!");
            })
            .catch(err => {
                console.error('Failed to copy text: ', err);
            });
    }


    const specialCharactersCheckbox = document.getElementById('specialCharacters');
    const numbersCheckbox = document.getElementById('numbers');
    const capitalLettersCheckbox = document.getElementById('capitalLetters');
    const lowercaseLettersCheckbox = document.getElementById('lowercaseLetters');
    const lengthInput = document.getElementById('length');

    // Function to check the contents of the password
    function checkPassword() {
        const password = passwordInput.value;
        // Regular expressions for checking different character types
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChars = /[\W_]/.test(password); // This checks for non-word characters and underscores

        // Set checkbox states based on the presence of character types
        capitalLettersCheckbox.checked = hasUppercase;
        lowercaseLettersCheckbox.checked = hasLowercase;
        numbersCheckbox.checked = hasNumbers;
        specialCharactersCheckbox.checked = hasSpecialChars;

        // Update the length input
        lengthInput.value = password.length;
    }

    // Add event listener to check the password whenever it changes
    passwordInput.addEventListener('input', checkPassword);

    // Initial check in case the password field is pre-filled (for example, when refreshing the page)
    checkPassword();
});


function generateQRs(passwords) {
    console.log(passwords);
    if (passwords.trim() === '') {
        alert('Please enter a password.');
        return;
    }

    // Clear previous QR code
    document.getElementById('qr-code').innerHTML = '';

    // Create QR code instance
    var qr = qrcode(0, 'L');
    qr.addData(passwords);
    qr.make();

    // Generate QR code image and display it
    var qrImage = qr.createImgTag();
    document.getElementById('qr-code').innerHTML = qrImage;
}


function generateRandomPassword(length = 12) {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+{}:<>?[];";
    let password = "";
    let characterCount = {
        lower: 0,
        upper: 0,
        number: 0,
        special: 0
    };

    // Helper function to identify the type of character
    function updateCharacterCount(character) {
        if (/[a-z]/.test(character)) {
            characterCount.lower++;
        } else if (/[A-Z]/.test(character)) {
            characterCount.upper++;
        } else if (/[0-9]/.test(character)) {
            characterCount.number++;
        } else {
            characterCount.special++;
        }
    }

    // Generate random characters until the password is of desired length
    while (password.length < length) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        const character = charset[randomIndex];
        password += character;
        updateCharacterCount(character);
    }

    // Check if all conditions are met
    function isValid() {
        return characterCount.lower > 0 && characterCount.upper > 0 &&
            characterCount.number > 0 && characterCount.special > 0;
    }

    // Regenerate the password if not valid
    while (!isValid()) {
        password = "";
        characterCount = { lower: 0, upper: 0, number: 0, special: 0 };
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charset.length);
            const character = charset[randomIndex];
            password += character;
            updateCharacterCount(character);
        }
    }

    return password;
}

// Verify password while logout and save all details in Encrypted file 
$(".verify").click(function () {
    var password = sessionStorage.getItem("password");
    var pass = $("#user_pass").val();
    if (pass == $("#password").val()) {
        $("#download").css("display", "block");
    } else if (pass == password) {
        $("#download").css("display", "block");

    }

    $(".signout").click(function () {
        clear_session();
    });
});

$(".signout").click(function () {
    clear_session();
});
