// Import your AccountData.json file below
import data from "../data/AccountData.json";

import type { UserProfile } from "@/lib/types";

export default function UserDetails({ user }: { user: UserProfile }) {
  const memberSince = new Date(user.created_at).toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });

  /**
   * Beneath is the section where we return HTML to display on our profile page!
   * 
   * You are going to need to create fields for the profile's username, email, bio, and streak. 
   * 
   * You can name the keys as what they are labeled (username, email, bio, streak)
   * 
   * Below, I've left comments on each variable you are going to replace with your key-value pair in your 
   * AccountData.json file. 
   */

  return (
    <section className="shrink-0 rounded-lg bg-slate-800 p-6">
      <h2 className="text-2xl font-bold mb-4">Profile Information</h2>

      <div className="flex items-center gap-4">

        <img src="/Profile.png" width={64} alt="Profile" className="rounded-full invert" />
        
        <div>
          {/* input your user field here */}
          <p className="text-xl font-semibold">{data.username}</p>
          {/* input your email field here */}
          <p className="text-m font-semibold">{data.email}</p>
          <p className="text-sm opacity-60">Wordler since {memberSince}</p>
        </div>
      </div>

      {/* input your bio field here */}
      <p className="mt-4 text-sm opacity-80">{data.bio || "No bio yet."}</p>

      <div className="mt-4 inline-block rounded bg-emerald-600 px-3 py-1 text-sm font-semibold">
        {/* input your streak field here */}
        🔥 {data.streak} game streak
      </div>
    </section>
  );
}