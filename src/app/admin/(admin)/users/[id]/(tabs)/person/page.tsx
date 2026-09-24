import { getUserById } from "@/modules/users/actions/users";
import { findPersonById } from "@/modules/persons/actions/find-by-id";
import { ErrorPage } from "@/ui";
import { redirect } from "next/navigation";
import { FormPerson } from "@/modules/persons/components/form/Form";
import { AvatarEditor } from "@/app/admin/profile/AvatarEditor";
import { updatePersonAvatar } from "@/modules/persons/actions/update-person-avatar";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function UserPersonPage({ params }: Props) {
  const { id } = await params;
  const userResponse = await getUserById(id);

  if (userResponse.error && userResponse.statusCode === 401) {
    redirect("/login");
  }

  if (userResponse.error) {
    return <ErrorPage message={userResponse.message} />;
  }

  const user = userResponse.data;

  if (!user.personId) {
    return (
      <div className="p-6 bg-content1 rounded-xl border border-divider">
        <p className="text-default-600">Este usuario no tiene una persona asociada.</p>
      </div>
    );
  }

  const personResponse = await findPersonById({ id: user.personId });

  if (personResponse.error) {
    return <ErrorPage message={personResponse.message} />;
  }

  const person = personResponse.data;

  // Bound action for the AvatarEditor
  const handleUpdateAvatar = async (formData: FormData) => {
    "use server";
    return updatePersonAvatar(user.personId!, formData);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1">
        <div className="bg-content1 p-6 rounded-xl border border-divider flex flex-col items-center justify-center">
          <AvatarEditor
            initialImageUrl={person.imageUrl}
            initials={person.name.charAt(0).toUpperCase()}
            altText={`Avatar de ${person.name}`}
            updateAction={handleUpdateAvatar}
          />
          <h3 className="font-bold text-lg text-on-surface mt-4 text-center">
            {person.name} {person.lastName}
          </h3>
          <p className="text-sm text-on-surface-variant uppercase tracking-wide font-semibold mt-1">
            Perfil Personal
          </p>
        </div>
      </div>
      <div className="lg:col-span-2">
        <div className="bg-content1 p-6 rounded-xl border border-divider">
          <FormPerson 
            person={person} 
            formId="edit-person-form" 
            buttonsSubmit={true} 
          />
        </div>
      </div>
    </div>
  );
}
