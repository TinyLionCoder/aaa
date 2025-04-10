export const CONTESTS = [
  {
    id: "community-contest-1",
    title: "AAA Community Contest",
    description:
      "Hey AAA family! Join our latest contest and earn AAA tokens for your participation.",
    platform: "Twitter",
    instructionsPartOne:
      "Follow @TinyLionCoder @Ghettopigeons",
    instructionsPartTwo:
      "Create a post on X saying: '$COO is cooking!! Check it out now before everyone else does: https://vestige.fi/asset/891226062 #Algorand #Crypto'",
    reward: 200,
    contactHandle: "@TinyLionCoder",
    expiryDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "default-contest",
    title: "AAA Community Contest",
    description:
      "Hey AAA family! Join our latest contest and earn AAA tokens for your participation.",
    platform: "Twitter",
    instructionsPartOne:
      "Earn 100 AAA! Create a testimony video about something you like in Algoadoptairdrop and upload it to YouTube. Once it's up, share it on X and tag  @TLPCoin To claim your AAA tokens. Bonus: Some of your testimonials might be featured on our website!",
    reward: 100,
    contactHandle: "@TLPCoin with your wallet address",
    expiryDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
];
