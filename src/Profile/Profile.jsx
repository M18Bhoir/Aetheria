import React from "react";

const Profile = () => {
  // You'll need to replace this with real user data,
  // possibly fetched from an API or local storage.
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    flat: "A-101"
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow">
        <h2 className="text-2xl font-bold mb-4">My Profile</h2>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-slate-500">Name</p>
            <p className="text-lg font-semibold">{user.name}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Email</p>
            <p className="text-lg font-semibold">{user.email}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Flat Number</p>
            <p className="text-lg font-semibold">{user.flat}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;