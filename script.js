const SUPABASE_URL = "https://jsktzygsmubrzolvwmvl.supabase.co";

const SUPABASE_ANON_KEY =
  "sb_publishable_3BKi5clnK9Od61zfDCIKZA__eAj8Zyv";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);


// ================================
// ACCOUNT ELEMENTS
// ================================

const emailInput = document.getElementById("account-email");
const passwordInput = document.getElementById("account-password");

const signupButton = document.getElementById("signup-btn");
const loginButton = document.getElementById("login-btn");

const resetPasswordButton =
  document.getElementById("reset-password-btn");

const logoutButton =
  document.getElementById("logout-btn");


const accountMessage = document.getElementById("account-message");

// ================================
// ACCOUNT MESSAGE
// ================================

function showMessage(message) {
  accountMessage.textContent = message;
}


// ================================
// ACCESS REQUEST MESSAGE
// ================================

function showAccessMessage(message) {
  accessRequestMessage.textContent = message;
}


// ================================
// CREATE ACCOUNT
// ================================

signupButton.addEventListener("click", async function () {

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  if (!email || !password) {
    showMessage("Please enter your email and password.");
    return;
  }

  if (password.length < 6) {
    showMessage("Password must be at least 6 characters.");
    return;
  }

  showMessage("Your account is being created...");

  try {

    const { data, error } =
      await supabaseClient.auth.signUp({
        email: email,
        password: password
      });

    if (error) {
      console.error("Signup error:", error);
      showMessage(error.message);
      return;
    }

    console.log("Created user:", data.user);
    console.log("Session:", data.session);

    showMessage(
      "Your account has been created successfully."
    );

  } catch (error) {

    console.error("Unexpected signup error:", error);

    showMessage(
      "Something went wrong. Please try again."
    );

  }

});


// ================================
// LOG IN
// ================================

loginButton.addEventListener("click", async function () {

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  if (!email || !password) {
    showMessage("Please enter your email and password.");
    return;
  }

  showMessage("Logging in...");

  try {

    const { data, error } =
      await supabaseClient.auth.signInWithPassword({
        email: email,
        password: password
      });

    if (error) {
      console.error("Login error:", error);
      showMessage(error.message);
      return;
    }


console.log("Logged in user:", data.user);

showMessage("Login successful.");

checkFullNovelAccess();


  } catch (error) {

    console.error("Unexpected login error:", error);

    showMessage(
      "Something went wrong. Please try again."
    );

  }

});

// ================================
// FORGOT PASSWORD
// ================================

resetPasswordButton.addEventListener(
  "click",
  async function () {

    const email = emailInput.value.trim();

    if (!email) {
      showMessage(
        "Please enter your email address first."
      );
      return;
    }

    showMessage(
      "Sending password reset email..."
    );

    try {

      const { error } =
        await supabaseClient.auth.resetPasswordForEmail(
          email,
          {
            redirectTo: "https://novels-by-blank.github.io/reset-password.html"
          }
        );

      if (error) {

        console.error(
          "Password reset error:",
          error
        );

        showMessage(error.message);

        return;
      }

      showMessage(
        "Password reset email sent. Please check your inbox."
      );

    } catch (error) {

      console.error(
        "Unexpected password reset error:",
        error
      );

      showMessage(
        "Something went wrong. Please try again."
      );

    }

  }
);

// ================================
// LOG OUT
// ================================

if (logoutButton) {

  logoutButton.addEventListener(
    "click",
    async function () {

      const { error } =
        await supabaseClient.auth.signOut();

      if (error) {

        console.error(
          "Logout error:",
          error
        );

        showMessage(
          "Unable to log out. Please try again."
        );

        return;
      }

      showMessage(
        "You have been logged out."
      );

      // Hide the full novel immediately
      const fullNovel =
        document.getElementById(
          "full-novel-content"
        );

      if (fullNovel) {
        fullNovel.style.display = "none";
      }

    }
  );

}

// ================================
// CHECK FULL NOVEL ACCESS
// ================================

async function checkFullNovelAccess() {

  const fullNovel =
    document.getElementById("full-novel-content");

  if (!fullNovel) {

    console.log(
      "Full novel container not found."
    );

    return;
  }

  // Keep the full novel hidden initially
  fullNovel.style.display = "none";

  // Check logged-in customer
  const {
    data: { user },
    error: userError
  } = await supabaseClient.auth.getUser();

  if (userError || !user) {

    console.log(
      "No logged-in customer."
    );

    return;
  }

  // Check approved access
  const {
    data: customerAccess,
    error: accessError
  } = await supabaseClient
    .from("customer_access")
    .select("has_access")
    .eq("user_id", user.id)
    .single();

  if (accessError) {

    console.error(
      "Full novel access check error:",
      accessError
    );

    return;
  }

  // Load complete novel only for approved customers
  if (
    customerAccess &&
    customerAccess.has_access === true
  ) {

const paymentSection =
  document.getElementById("payment");

if (paymentSection) {
  paymentSection.style.display = "none";
}


try {

  const {
    data: novelFile,
    error: novelError
  } = await supabaseClient
    .storage
    .from("full-novel")
    .download("full-novel.html");

  if (novelError) {

    throw new Error(
      "Unable to load full novel: " +
      novelError.message
    );

  }

  if (!novelFile) {

    throw new Error(
      "Full novel file was not returned."
    );

  }

  const html =
    await novelFile.text();

      const parser =
        new DOMParser();

      const documentContent =
        parser.parseFromString(
          html,
          "text/html"
        );

      const novelContent =
        documentContent.querySelector(
          ".full-novel-content"
        );

      if (!novelContent) {

        throw new Error(
          "Full novel content not found."
        );

      }

      fullNovel.innerHTML =
        novelContent.innerHTML;

      fullNovel.style.display =
        "block";

      console.log(
        "Full novel access approved and content loaded."
      );

    } catch (error) {

      console.error(
        "Full novel loading error:",
        error
      );

    }

  }

}


// Run access check
checkFullNovelAccess();

// ================================
// PAYMENT SUBMISSION
// ================================

const paymentForm =
  document.getElementById("payment-form");

const paymentMethod =
  document.getElementById("payment-method");

const transactionId =
  document.getElementById("transaction-id");

const paymentName =
  document.getElementById("payment-name");

const paymentMessage =
  document.getElementById("payment-message");


if (paymentForm) {

  paymentForm.addEventListener(
    "submit",
    async function (event) {

      event.preventDefault();

      paymentMessage.textContent =
        "Checking your account...";


      // Check logged-in user

      const {
        data: { user },
        error: userError
      } = await supabaseClient.auth.getUser();


      if (userError || !user) {

        paymentMessage.textContent =
          "Please log in before submitting payment details.";

        return;
      }


      // Check whether customer already has access

      const {
        data: customerAccess,
        error: accessError
      } = await supabaseClient
        .from("customer_access")
        .select("has_access")
        .eq("user_id", user.id)
        .single();


      if (accessError) {

        console.error(
          "Access check error:",
          accessError
        );

        paymentMessage.textContent =
          "Unable to check your account. Please try again.";

        return;
      }


      if (
        customerAccess &&
        customerAccess.has_access === true
      ) {

        paymentMessage.textContent =
          "Your access has already been approved.";

        return;
      }


      // Check for an existing pending payment

      const {
        data: existingPayments,
        error: existingError
      } = await supabaseClient
        .from("payment_submissions")
        .select("id")
        .eq("user_id", user.id)
        .eq("status", "pending")
        .limit(1);


      if (existingError) {

        console.error(
          "Payment check error:",
          existingError
        );

        paymentMessage.textContent =
          "Unable to check your previous payment. Please try again.";

        return;
      }


      if (
        existingPayments &&
        existingPayments.length > 0
      ) {

        paymentMessage.textContent =
          "Your payment is already under review.";

        return;
      }


      // Submit payment details

      const {
        data: payment,
        error: paymentError
      } = await supabaseClient
        .from("payment_submissions")
        .insert([
          {
            user_id: user.id,
            email: user.email,
            payment_method: paymentMethod.value,
            transaction_id: transactionId.value.trim(),
            payment_name: paymentName.value.trim(),
            status: "pending"
          }
        ])
        .select()
        .single();


      if (paymentError) {

        console.error(
          "Payment submission error:",
          paymentError
        );

        paymentMessage.textContent =
          "Unable to submit your payment details. Please try again.";

        return;
      }


      console.log(
        "Payment submitted:",
        payment
      );


      paymentMessage.textContent =
        "Your payment details have been submitted successfully. Please wait for verification.";

      paymentForm.reset();

    }
  );

}