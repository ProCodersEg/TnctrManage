const axios = require('axios');
const crypto = require('crypto');
const moment = require('moment');

const SecretId = 'IKIDrojT8g4IJ6h8LNCxZ3OXcdzEMJFxSmvq';
const SecretKey = 'nMkaIoCOMAygEervnW4ymNlvsc8Rl8MM';
const SdkAppId = 20021644;
const Region = 'ap-singapore';
const Service = 'trtc';
const Host = 'trtc.tencentcloudapi.com';
const Version = '2019-07-22';

const hmac = (key, str) => crypto.createHmac('sha256', key).update(str).digest();

function buildAuthHeaders(action, payload, timestamp) {
  const date = moment.utc(timestamp * 1000).format('YYYY-MM-DD');
  const canonicalRequest = POST\n/\n\ncontent-type:application/json\nhost:${Host}\n\ncontent-type;host\n${crypto.createHash('sha256').update(JSON.stringify(payload)).digest('hex')};
  const credentialScope = ${date}/${Service}/tc3_request;
  const stringToSign = TC3-HMAC-SHA256\n${timestamp}\n${credentialScope}\n${crypto.createHash('sha256').update(canonicalRequest).digest('hex')};
  const secretDate = hmac(TC3${SecretKey}, date);
  const secretService = hmac(secretDate, Service);
  const secretSigning = hmac(secretService, 'tc3_request');
  const signature = crypto.createHmac('sha256', secretSigning).update(stringToSign).digest('hex');

  return {
    'Content-Type': 'application/json',
    'Host': Host,
    'X-TC-Action': action,
    'X-TC-Version': Version,
    'X-TC-Region': Region,
    'X-TC-Timestamp': timestamp.toString(),
    'Authorization': TC3-HMAC-SHA256 Credential=${SecretId}/${credentialScope}, SignedHeaders=content-type;host, Signature=${signature}
  };
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Only POST allowed' });

  const { action, roomId, userId, userIds, isMute } = req.body;
  if (!action || !roomId) return res.status(400).json({ error: 'Missing required fields' });

  const payload = {
    SdkAppId,
    RoomId: roomId
  };

  if (userId) payload.UserId = userId;
  if (userIds) userIds.forEach((u, i) => payload[UserIds.${i}] = u);
  if (isMute !== undefined) payload.IsMute = isMute;

  const timestamp = Math.floor(Date.now() / 1000);
  const headers = buildAuthHeaders(action, payload, timestamp);

  try {
    const response = await axios.post(https://${Host}/, payload, { headers });
    res.status(200).json({ success: true, data: response.data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.response?.data || error.message });
  }
};
