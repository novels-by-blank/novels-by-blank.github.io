const SUPABASE_URL =
  "https://jsktzygsmubrzolvwmvl.supabase.co";

const SUPABASE_ANON_KEY =
  "sb_publishable_3BKi5clnK9Od61zfDCIKZA__eAj8Zyv";


const supabaseClient =
  window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
  );


// ================================
// PAYMENT SUBMISSIONS
// ================================

const paymentsContainer =
  document.getElementById(
    "payments-container"
  );


// ================================
// LOAD PAYMENT SUBMISSIONS
// ================================

async function loadPaymentSubmissions() {

  if (!paymentsContainer) {
    return;
  }

  paymentsContainer.innerHTML =
    '<p class="admin-empty">Loading payment submissions...</p>';


  const {
    data: payments,
    error
  } = await supabaseClient.rpc(
    "get_payment_submissions"
  );


  if (error) {

    console.error(
      "Error loading payments:",
      error
    );

    paymentsContainer.innerHTML =
      '<p class="admin-empty">Unable to load payment submissions.</p>';

    return;
  }


  if (!payments || payments.length === 0) {

    paymentsContainer.innerHTML =
      '<p class="admin-empty">No payment submissions found.</p>';

    return;
  }


  paymentsContainer.innerHTML = "";


  payments.forEach(function (payment) {

    const paymentCard =
      document.createElement("div");


    paymentCard.className =
      "admin-request";


    paymentCard.innerHTML = `

      <div class="admin-request-info">

        <strong>
          ${payment.email || "No email"}
        </strong>

        <span>
          Payment Method:
          ${payment.payment_method}
        </span>

        <span>
          Transaction ID:
          ${payment.transaction_id}
        </span>

        <span>
          Payment Name:
          ${payment.payment_name}
        </span>

        <span>
          Status:
          ${payment.status}
        </span>

        <span>
          Submitted:
          ${new Date(
            payment.created_at
          ).toLocaleString()}
        </span>

      </div>


      ${
        payment.status === "pending"
          ? `
            <button
              class="btn btn-primary approve-payment-btn"
              data-payment-id="${payment.id}"
            >
              Approve Payment
            </button>
          `
          : `
            <span class="approved-label">
              Payment Approved
            </span>
          `
      }

    `;


    paymentsContainer.appendChild(
      paymentCard
    );

  });


  // ================================
  // PAYMENT APPROVAL BUTTONS
  // ================================

  const approvePaymentButtons =
    document.querySelectorAll(
      ".approve-payment-btn"
    );


  approvePaymentButtons.forEach(function (button) {

    button.addEventListener(
      "click",
      function () {

        approvePayment(
          button.dataset.paymentId,
          button
        );

      }
    );

  });

}


// ================================
// APPROVE PAYMENT
// ================================

async function approvePayment(
  paymentId,
  button
) {

  const confirmed =
    confirm(
      "Are you sure you want to approve this payment?"
    );


  if (!confirmed) {
    return;
  }


  button.disabled = true;

  button.textContent =
    "Approving...";


  const {
    data,
    error
  } = await supabaseClient
    .rpc(
      "approve_payment_submission",
      {
        payment_id: paymentId
      }
    );


  if (error) {

    console.error(
      "Payment approval error:",
      error
    );

    alert(
      "Unable to approve this payment: " +
      error.message
    );

    button.disabled = false;

    button.textContent =
      "Approve Payment";

    return;
  }


  console.log(
    "Payment approved:",
    data
  );


  alert(
    "Payment approved successfully. Full novel access has been unlocked."
  );


  loadPaymentSubmissions();

}


// ================================
// START
// ================================

loadPaymentSubmissions();