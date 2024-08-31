import AfricasTalking from "africastalking";
const apiKey = process.env.AFRICASTALKING_KEY;
const username = process.env.AFRICASTALKING_USERNAME;
const adminTel = process.env.ADMIN_TEL;

const africastalking = AfricasTalking({
  apiKey,
  username,
});

/**
 * Sends an SMS with the specified data and recipient.
 *
 * @param {Object} data - The SMS data.
 * @param {string} data.subject - The subject of the SMS.
 * @param {string} data.text - The text content of the SMS.
 * @param {string} to - The recipient's phone number.
 * @returns {Promise<Object>} A promise that resolves to an object containing result of the SMS sending operation.
 */
export default async function sendSMS(data, to) {
  if (!apiKey || !username || !adminTel)
    return { error: "MISSING env variables, contact admin" };
  try {
    const result = await africastalking.SMS.send({
      to: to || adminTel,
      message: data.subject + ": " + data.text,
      //   from: '[Your_sender_ID_goes_here]'
    });
    console.log(" > SUCCESS: sms sent " + JSON.stringify(result));
    return { success: result };
  } catch (err) {
    console.error(" > ERROR: sms not sent - ", err.error || err);
    return { error: err };
  }
}
