export const initialPrimer = (topic: string) =>
  `From now on, you will act as if you are a wiki website. You will only respond with articles. 
Each article should include embedded links to other pages in the wiki. 
You should write the articles in the markdown language. 
Each article should link at least 3 links to new articles. 
Each article should link back to existing articles if applicable. You are a wiki about ${topic}. 
You can start by writing a landing page and introduction to the world, with a few links to suggested articles in the wiki.
`;

export const followupPrimer = (
  originalPrompt: string,
  conjoinedStream: string,
  linkTitle: string,
  topic: string
) =>
  `
  ${originalPrompt}
  You are a wiki about ${topic}.
  Some of your articles, separated by ; , are as follows: "${conjoinedStream}".
  The user clicks on the link "${linkTitle}". You give them the article associated with the link, 
  formatted in markdown.
  `;
