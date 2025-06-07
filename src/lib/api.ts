const callApi = async () => {
  const prompt =
    "Imagine you're a bouncer at a club. Determine whether or not to let " +
    "this person in based on this description: " +
    "Likes drinking decaf coffee";
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