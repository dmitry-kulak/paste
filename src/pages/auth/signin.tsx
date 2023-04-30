import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import { getProviders, signIn } from "next-auth/react";

import { getServerAuthSession } from "@/server/auth";

type SignInProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const SignIn: NextPage<SignInProps> = ({ providers }) => (
  <div className="flex flex-col items-center gap-2">
    <h1 className="mb-2 text-2xl font-bold">Sign In</h1>

    {providers.map((provider) => (
      <div key={provider.name}>
        <button
          className="rounded border bg-zinc-50 px-4 py-2 text-black"
          onClick={() => signIn(provider.id)}
        >
          Sign in with {provider.name}
        </button>
      </div>
    ))}
  </div>
);
export default SignIn;

export const getServerSideProps = (async (context) => {
  const session = await getServerAuthSession(context);

  if (session) {
    return { redirect: { destination: "/" }, props: { providers: [] } };
  }

  const providers = await getProviders();

  return {
    props: { providers: Object.values(providers ?? {}) },
  };
}) satisfies GetServerSideProps;
