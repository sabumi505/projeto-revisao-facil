import { PrismaClient } from "@prisma/client";
import { RequestInternal } from "next-auth";
import Credentials from "next-auth/providers/credentials";

const prisma = new PrismaClient();

export const nextAuthOptions = {
  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/auth",
  },

  callbacks: {
    jwt: async ({ token, user }: { token: any, user: any }) => {
      console.log("======[JWT BEGIN]========");
      /**
       * IMPORTANT NOTE DUE TO LACK OF DECENT DOCS FROM NEXT-AUTH
       * 
       * The user object from object param above gets data __ONLY AFTER LOGIN__,
       * thus, all other situations when this function is executed while user is already
       * logged the param >user< will be undefined/null (empty object);
       * 
       * Due to that, the object returned by this callback must return all data user object has.
      */
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      console.log("======[JWT END]========");
      return token;
    },
    session: async (params: any) => {
       /**
       * IMPORTANT NOTE DUE TO LACK OF DECENT DOCS FROM NEXT-AUTH
       * 
       * This callback will receive the data treated by the JWT callback
      */
      console.log("======[SESSION BEGIN]========");
      console.log( JSON.stringify(params) );
      if (params.token.id) {
        // params.session.user.id = params.token.id;
        params.session = {...params.session, user: { ...params.session.user, id: params.token.id }};
      }
      if (params.token.role) {
        // params.session.user.role = params.token.role;
        params.session = {...params.session, user: { ...params.session.user, role:params.token.role }};
      }
      console.log("======[SESSION END]========");
      return params.session;
    },
  },

  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials: Record<"email" | "password", string> | undefined, req: Pick<RequestInternal, "body" | "query" | "headers" | "method">) {
        // @ts-ignore
        const { email, password, role, mode, name } = credentials || {};

        if (!email || !password || !role) {
          throw new Error("Parametros invalidos");
        }

        if (mode === "signup") {
          return signUpResolver(email, password, name, role);
        }
        return loginInResolver(email, password, role);
      },
    }),
  ],
}


async function signUpResolver(email: string, password: string, name: string, role: string) {
  if (role === "student") {
    return studentSignUp(email, password, name);
  }
  return teacherSignUp(email, password, name);
}

async function studentSignUp(email: string, password: string, name: string) {
  const student = await prisma.student.findUnique({
    where: { email },
  });
  if (student) {
    throw new Error(`Ja existe estudante com email ${email}`);
  }
  try {
    const newUser = await prisma.student.create({
      data: {
        email,
        password,
        name,
        role: 'student'
      },
    });
    return newUser;
  } catch (error) {
    console.log(JSON.stringify({
      message: "failed to create student",
      // @ts-ignore
      error: error.message,
      email,
      name,
      password,
    }));
    // @ts-ignore
    throw new Error(`Erro ao criar estudante: ${error.message}`);
  }
}

async function teacherSignUp(email: string, password: string, name: string) {
  const teacher = await prisma.teacher.findUnique({
    where: { email },
  });
  if (teacher) {
    throw new Error(`Ja existe professor com email ${email}`);
  }
  try {
    const newUser = await prisma.teacher.create({
      data: {
        email,
        password,
        name,
        role: 'teacher'
      },
    });
    return newUser;
  } catch (error) {
    console.log(JSON.stringify({
      message: "failed to create teacher",
      // @ts-ignore
      error: error.message,
      email,
      name,
      password,
    }));
    // @ts-ignore
    throw new Error(`Erro ao criar professor: ${error.message}`);
  }
}

async function loginInResolver(email: string, password: string, role: string) {
  if (role === "student") {
    return studentLoginIn(email, password);
  }
  return teacherLogin(email, password);
}

async function studentLoginIn(email: string, password: string) {
  const student = await prisma.student.findUnique({
    where: { email },
  });
  if (!student) {
    throw new Error(`Nao existe conta de aluno com email ${email}`);
  }
  return student;
}

async function teacherLogin(email: string, password: string) {
  const teacher = await prisma.teacher.findUnique({
    where: { email },
  });
  if (!teacher) {
    throw new Error(`Nao existe conta de professor com email ${email}`);
  }
  return teacher;
}


