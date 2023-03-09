import { CIDString, Web3Storage, File } from "web3.storage";

const web3Api = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDU2Rjk5MURkRTlCZmU2MzJGOTBkQTBkYTIxOTJkNzU3OTQ2NzhhYzQiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NzUzMjc5MjcxNDUsIm5hbWUiOiJUZXN0IE1hcmtldHBsYWNlIn0.gzG8psFyp_-VqcXuotXCi4o-0qOrC2dg-Ygz7SPxIyg';
const client = new Web3Storage({ token: web3Api });

export const putFileWeb3 = async (fileContent: string | Blob, fileName: string, type: string): Promise<CIDString> => {
  const file = new File([fileContent], fileName, { type });
  const cid = await client.put([file]);
  return cid;
}