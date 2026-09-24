import { getDetailedProfile } from "@/modules/users/actions/get-detailed-profile";
import { ProfileModalShell } from "./ProfileModalShell";
import { SelfProfileContent } from "../../profile/SelfProfileContent";

export default async function InterceptedProfilePage() {
  const profileResponse = await getDetailedProfile();
  
  if (profileResponse.error || !profileResponse.data) {
    return null;
  }

  return (
    <ProfileModalShell>
      <SelfProfileContent profile={profileResponse.data} />
    </ProfileModalShell>
  );
}
