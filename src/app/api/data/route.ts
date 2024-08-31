import prisma from "@/lib/prisma/prisma";
import { compareHash } from "@/lib/utils";
// export const dynamic = "auto"; // 'auto' | 'force-dynamic' | 'error' | 'force-static'
export const revalidate = 60; //after 7 days // false | 0 | number

// GET ui data
const getHandler = async (request: Request) => {
  try {
    // console.log(`GET REQUEST: UI data: `);

    // //  API call
    // const data1 = await prisma.mp.findMany({
    //   include: {
    //     constituency: true,
    //   },
    // });

    // const data2 = await prisma.legislation.findMany();
    
    //if (!data1 || !data2) {console.error("failed to fetch data: api/data - GET"); return Response.json({ error: "DATABASE ERROR" });}
    return Response.json({
      success: { data1: [], data2: [] },
    });
  } catch (err: any) {
    console.error("ERROR in route: api/data - GET \n > ", err);
    return Response.json({ error: "SERVER ERROR" });
  }
};



// export const POST = postHandler;
export const GET = getHandler;

