import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import fetch from 'node-fetch';

admin.initializeApp();

export const ntpcHolidays = functions.https.onRequest(async (req, res) => {
  try {
    const response = await fetch(
      'https://data.ntpc.gov.tw/api/datasets/308dcd75-6434-45bc-a95f-584da4fed251/json?size=1000',
    );
    const data = await response.json();

    // 設定允許跨域
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.status(200).json(data);
  } catch (err) {
    console.error('Fetch failed:', err);
    res.status(500).json({ error: '代理失敗', detail: err instanceof Error ? err.message : err });
  }
});
