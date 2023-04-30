import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import type { MouseEventHandler } from "react";
import type { Session } from "next-auth";
import { signOut } from "next-auth/react";

import { getServerAuthSession } from "@/server/auth";

type ProfilePageProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const ProfilePage: NextPage<ProfilePageProps> = ({ user }) => {
  const router = useRouter();
  const signOutAndRedirect: MouseEventHandler<HTMLButtonElement> = () => {
    signOut()
      .catch((err) => console.error(err))
      .finally(() => router.push("/"));
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <span className="flex items-center gap-4">
        <Image
          src={user.image ?? ""}
          alt="User profile picture"
          className="rounded-full"
          height={48}
          width={48}
        />
        {user.name}
      </span>

      <div className="mt-4">
        <button
          className="rounded border bg-zinc-50 px-4 py-2 text-black"
          onClick={signOutAndRedirect}
        >
          Sign out
        </button>
      </div>
    </div>
  );
};

export const getServerSideProps = (async (context) => {
  const session = await getServerAuthSession(context);

  if (!session) {
    return {
      redirect: { destination: "/" },
      props: { user: {} as Session["user"] },
    };
  }

  return {
    props: { user: session.user },
  };
}) satisfies GetServerSideProps;

export default ProfilePage;
