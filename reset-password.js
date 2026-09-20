const SUPABASE_URL =
  "https://jsktzygsmubrzolvwmvl.supabase.co";

const SUPABASE_ANON_KEY =
  "sb_publishable_3BKi5clnK9Od61zfDCIKZA__eAj8Zyv";

const supabaseClient =
  window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
  );


const newPasswordInput =
  document.getElementById("new-password");

const confirmPasswordInput =
  document.getElementById("confirm-password");

const updatePasswordButton =
  document.getElementById("update-password-btn");

const resetMessage =
  document.getElementById("reset-message");


updatePasswordButton.addEventListener(
  "click",
  async function () {

    const newPassword =
      newPasswordInput.value;

    const confirmPassword =
      confirmPasswordInput.value;


    if (!newPassword || !confirmPassword) {

      resetMessage.textContent =
        "Please enter and confirm your new password.";

      return;
    }


    if (newPassword.length < 6) {

      resetMessage.textContent =
        "Password must be at least 6 characters.";

      return;
    }


    if (newPassword !== confirmPassword) {

      resetMessage.textContent =
        "The passwords do not match.";

      return;
    }


    resetMessage.textContent =
      "Updating your password...";


    const {
      data,
      error
    } = await supabaseClient.auth.updateUser({
      password: newPassword
    });


    if (error) {

      console.error(
        "Password update error:",
        error
      );

      resetMessage.textContent =
        error.message;

      return;
    }


    console.log(
      "Password updated:",
      data
    );


    resetMessage.textContent =
      "Your password has been updated successfully.";

  }
);