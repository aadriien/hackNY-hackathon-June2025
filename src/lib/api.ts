const callApi = async (
  questionnaireText: string,
  expressionsPrompt?: string
) => {
  const systemPrompt =
    "Imagine you're a bouncer at a club or a mean hostess. Determine whether or not to let " +
    "this person in based on these questionnaire answers, be mean to them, use gay and gen z slang language, roast them in an insufferable tiktok influencer tone";

  const userPrompt = `${systemPrompt}\n\nUser's Answers:\n${questionnaireText}\n\nFacial Expressions:\n${expressionsPrompt ?? 'N/A'}`;

  const response = await fetch("https://text.pollinations.ai/openai", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "openai",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: userPrompt }
          ]
        }
      ]
    })
  });

  return response.json();
};

export default callApi;
