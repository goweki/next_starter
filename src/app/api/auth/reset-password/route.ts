import prisma from "@/lib/prisma/prisma";
import sendEmail, { generateEmail } from "@/lib/emailService";
import { type NextRequest } from "next/server";
import crypto from "crypto";
import { dateShort, getCanonicalURL, hash } from "@/lib/utils";

export const dynamic = "auto"; // 'auto' | 'force-dynamic' | 'error' | 'force-static'

const maxUsers = Number(process.env.USER_COUNT_CHECKPOINT) || 100;

// POST: CREATES or UPDATES user and sends password set link.
/**
 *
 * @param request API call
 * @returns
 */
const postHandler = async (request: Request) => {
  try {
    // request body
    const { email, action } = await request.json();

    console.log(
      "POST REQUEST: to /api/auth/reset-password: \n > : ",
      action,
      " ",
      email
    );
    let userExists = await prisma.user.findUnique({
      where: { email },
    });

    // create user if user doesnt exist in db
    if (!userExists) {
      // if to reset password
      if (action === "reset") {
        return Response.json({
          failed: "User does not exist",
        });
      }
      const userCount = await prisma.user.count();
      // if users count exceeds set checkpoint exit
      if (userCount > maxUsers) {
        console.warn("Users limit count attained, failed to create: ", email);
        return Response.json({
          failed:
            "Users quota exceeded. Try again later or contact admin via goweki.com",
        });
      }
      userExists = await prisma.user.create({
        data: {
          email,
        },
      });
    } else {
      // if to signUp and userExists
      if (action === "signUp") {
        return Response.json({
          failed: "User already exists",
        });
      }
    }
    // now user exists in db
    const resetToken = crypto.randomBytes(20).toString("hex");
    const passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    const passwordResetExpires = Date.now() + 3600000; // 1 hour from now
    //update db
    const updatedUser = await prisma.user.update({
      where: { id: userExists.id },
      data: {
        resetToken: passwordResetToken,
        resetTokenExpiry: new Date(passwordResetExpires),
      },
    });
    if (!updatedUser) {
      console.error("Password Reset link NOT SAVED: \n", userExists);
      return Response.json({
        failed: "Error generating reset link, try again later",
      });
    }
    console.log("Password Reset link SAVED: \n", updatedUser);
    //reset password URL
    const resetURL = `${getCanonicalURL()}/reset-password/${resetToken}/?email=${email}`;
    // const html = emailHTML(
    //   updatedUser.name,
    //   resetURL,
    //   "Reset your password (Lisa)"
    // );

    const res_generateEmail = generateEmail(action, "Hi", resetURL);
    if ("error" in res_generateEmail) {
      console.log(res_generateEmail.error);
      return Response.json({ error: "SERVER ERROR" });
    }
    const { html, text } = res_generateEmail;
    const res_sendEmail = await sendEmail(
      "Reset Password - (bunge-scope)",
      html,
      text,
      email
    );
    if ("success" in res_sendEmail) {
      return Response.json({ success: "Successful! Check email for a link" });
    }
    return Response.json({
      failed: "Failed to send the link, try again later",
    });
  } catch (err) {
    console.error("ERROR in route: api/auth/reset-password - POST \n > ", err);
    return Response.json({ error: "SERVER ERROR" });
  }
};

// PUT
const putHandler = async (request: Request) => {
  try {
    // request body
    const doc = await request.json();
    const { email, name, password, token } = doc;
    console.log(`PUT REQUEST: update user data: \n > `, doc);
    // update doc
    const updateUser = await prisma.user.update({
      where: { email },
      data: {
        name,
        password: await hash(password),
        resetToken: null,
        resetTokenExpiry: null,
      },
    });
    if (!updateUser) return Response.json({ failed: "Database error" });
    //success
    console.log("SUCCESS: Password updated\n >", updateUser);
    return Response.json({ success: "Password updated" });
  } catch (err) {
    console.error("ERROR in route: api/auth/reset-password - PUT \n > ", err);
    return Response.json({ error: "SERVER ERROR" });
  }
};

// GET
const getHandler = async (request: NextRequest) => {
  try {
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get("email") as string;
    const token = searchParams.get("token") as string;
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    // console.log("VALIDATING email-", email, "token-", token);

    const userExists = await prisma.user.findUnique({
      where: {
        email: email,
        resetToken: hashedToken,
        resetTokenExpiry: {
          gt: new Date(),
        },
      },
    });
    if (!userExists) {
      return Response.json({ failed: "Invalid token" });
    } else {
      //user exists
      return Response.json({
        success: "Enter new password",
        name: userExists.name,
      });
    }
    //
  } catch (err: any) {
    console.log("ERROR in route: api/auth/reset-password >", err);
    return Response.json({ error: err.message });
  }
};

// DELETE
const deleteHandler = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    console.log(`PUT REQUEST: item data: `, id);
    //return Response.json({ success: 'action performed' });
    //return Response.json({ failed: 'action NOT performed' });
  } catch (err: any) {
    console.error(
      "ERROR in route: api/auth/reset-password - DELETE \n > ",
      err
    );
    return Response.json({ error: "SERVER ERROR" });
  }
};

// export const POST = withAuthAdmin(postHandler);
// export const PUT = withAuthAdmin(putHandler);
// export const GET = withAuthAdmin(getHandler);
// export const DELETE = withAuthAdmin(deleteHandler);
export const POST = postHandler;
export const PUT = putHandler;
export const GET = getHandler;
export const DELETE = deleteHandler;

type Action = "signUp" | "reset";
