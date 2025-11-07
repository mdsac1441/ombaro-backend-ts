import { DBClient, oneTimeToken, TokenType } from "../../../databases/postgres/schema";

export async function addOneTimeToken(
  tokenId: string,
  expiresAt: Date,
  tokenType: TokenType
): Promise<string> {
  try {
    const [token] = await DBClient.insert(oneTimeToken).values({
      tokenId,
      expiresAt,
      tokenType,
    }).returning({ insertedTokenId: oneTimeToken.tokenId });

    return token.insertedTokenId
  } catch (error) {
    console.log(error);
    
    throw new Error("Failed to create one-time token")
  }
}