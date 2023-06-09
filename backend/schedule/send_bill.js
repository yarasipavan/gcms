// import transpoter to send emails
const { transporter } = require("../custom_modules/transporter");

const sendBill = async (email, bill_details) => {
  var mailOptions = {
    from: "Admin",
    to: email,
    subject:
      "Monthly Bill Generated|Gated Community Management System -Testing",
    html: `<!DOCTYPE html>
    <html>
      <head>
        <style>
          /* CSS styles for the email template */
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            background-color: #f4f4f4;
          }
    
          h1 {
            color: #333;
          }
    
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
    
          th,
          td {
            padding: 10px;
            text-align: left;
            border-bottom: 1px solid #ddd;
          }
    
          th {
            background-color: #f2f2f2;
          }
    
          p.total-amount {
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <h1>Bill Details</h1>
        <table>
          <thead>
            <tr>
              <th>Billed On</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
          <tr>
          <td>Flat rent</td>
          <td>${bill_details.rent_bill}</td>
        </tr>
            <tr>
              <td>Swimming Pool</td>
              <td>${bill_details.swimming_pool_bill}</td>
            </tr>
            <tr>
              <td>Parking</td>
              <td>${bill_details.parking_bill}</td>
            </tr>
            <tr>
              <td>House Keeping </td>
              <td>${bill_details.house_keeping_bill}</td>
            </tr>
            <tr>
              <td>Gym</td>
              <td>${bill_details.gym_bill}</td>
            </tr>
            <tr>
              <td>Park</td>
              <td>${bill_details.park_bill}</td>
            </tr>
            <tr>
              <td>Indoor auditorium</td>
              <td>${bill_details.indoor_auditorium_bill}</td>
            </tr>
            <tr>
              <td>Security *</td>
              <td>${bill_details.security_bill}</td>
            </tr>
            <tr>
              <td>Maintenance *</td>
              <td>${bill_details.maintenance_bill}</td>
            </tr>
            <tr>
              <td>Gardening *</td>
              <td>${bill_details.gardening_bill}</td>
            </tr>
            <tr>
              <td>Charity *</td>
              <td>${bill_details.charity_bill}</td>
            </tr>
            <tr>
              <td>Community *</td>
              <td>${bill_details.community_bill}</td>
            </tr>
          </tbody>
        </table>
        <p class="total-amount">Total Amount: ${bill_details.total_bill}</p>
        <p>Billed On : ${new Date(bill_details.billed_date)}</p>
      </body>
    </html>
    `,
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      return false;
    } else {
      console.log("Email sent: " + info.response);
      return true;
    }
  });
};

module.exports = sendBill;
