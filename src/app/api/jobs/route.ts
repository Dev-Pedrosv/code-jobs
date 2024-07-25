import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";

export async function GET() {
  const serviceAccountAuth = new JWT({
    email: process.env.NEXT_PUBLIC_GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.NEXT_PUBLIC_GOOGLE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const doc = new GoogleSpreadsheet(
    process.env.NEXT_PUBLIC_GOOGLE_PRIVATE_SPREADSHEET_ID!,
    serviceAccountAuth
  );

  try {
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows();
    const data = rows.map((row: any) => {
      return row._rawData;
    });

    const formattedData = data.map((d) => {
      return {
        title: d[0],
        link: d[1],
        seniority: d[2],
        locale: d[3],
        createdAt: d[4],
      };
    });

    return Response.json({ data: formattedData });
  } catch (error) {
    console.error("Error loading spreadsheet:", error);
    Response.json({ error: "Error loading spreadsheet" });
  }
}
