const callApi = async (result: string) => {
  const prompt =
    "Imagine you're a bouncer at a club or a mean host at an exclusive restaurant. Determine whether or not to let " +
    "this person in based on their response. Try to be as mean as you can, the idea of this is to be sarcastic of their actions. Try to roast the user in a mean, gay slang tone " +
    "Here is the user's response" + `${result}`
  const response = await fetch("https://text.pollinations.ai/openai", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "openai",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            // {
            //   type: "image_url",
            //   image_url: { url: "data:image/jpeg;base64,{base64_string}" },
            // },
          ],
        },
      ],
    }),
  });

  return response.json();
};

export default callApi;