/**
 * Validates a Cloudflare Turnstile token
 * @param {string} token - The token from the client-side turnstile widget
 * @param {string} ip - Optional client's IP address
 * @returns {Promise<boolean>} - Whether the token is valid
 */
async function validateTurnstile(token, ip) {
  if (!token) return false;

  const secretKey = process.env.TURNSTILE_SECRET_KEY;
  if (!secretKey) {
    console.warn('TURNSTILE_SECRET_KEY is not defined in environment variables. Skipping validation.');
    return true; // Don't block if not configured correctly, but warn
  }

  try {
    const formData = new URLSearchParams();
    formData.append('secret', secretKey);
    formData.append('response', token);
    if (ip) formData.append('remoteip', ip);

    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Turnstile validation error:', error);
    return false;
  }
}

module.exports = { validateTurnstile };
