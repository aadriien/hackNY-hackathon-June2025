const callApi = async (
  questionnaireText: string,
  expressionsPrompt?: string
) => {
  const systemPrompt =
    "Imagine you're a bouncer at a club. Determine whether or not to let " +
    "this person in based on this description: Likes drinking decaf coffee.";

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
