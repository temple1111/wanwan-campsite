export default async function handler(req, res) {
  // ブラウザから送信された会話履歴を取得
  const { history } = req.body;

  // 会話履歴がない場合はエラーを返す
  if (!history) {
    return res.status(400).json({ error: 'Chat history is required' });
  }

  // Vercelの環境変数から安全にAPIキーを読み込む
  const apiKey = process.env.GEMINI_API_KEY;
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  try {
    // Gemini APIへリクエストを転送
    const geminiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ contents: history }) // 受け取った会話履歴をそのまま送信
    });

    // Gemini APIからの応答がエラーだった場合
    if (!geminiResponse.ok) {
      console.error('Gemini API Error:', await geminiResponse.text());
      throw new Error('Gemini APIからの応答エラー');
    }

    // 成功した結果をブラウザに返す
    const data = await geminiResponse.json();
    res.status(200).json(data);

  } catch (error) {
    console.error('Server-side error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
