import { redirect } from "next/navigation";

const VALID_TABS = ["inventory", "hearth", "souls", "bugs", "zones"];

interface PageProps {
  params: Promise<{ tab: string }>;
}

export default async function Page({ params }: PageProps) {
  const { tab } = await params;
  
  if (!VALID_TABS.includes(tab)) {
    redirect("/");
  }

  redirect(`/zelda-tp/${tab}`);
}
