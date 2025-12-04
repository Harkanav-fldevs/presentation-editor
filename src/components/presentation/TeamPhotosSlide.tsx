"use client";

import React from "react";
import { TeamPhotosData } from "@/mastra/types/slide-templates";

interface TeamPhotosSlideProps {
  title?: string;
  teamData: TeamPhotosData;
}

export function TeamPhotosSlide({ title, teamData }: TeamPhotosSlideProps) {
  // Add comprehensive null/undefined checks
  if (!teamData || !teamData.members || !Array.isArray(teamData.members)) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        {title && <h2 className="text-xl font-bold mb-4">{title}</h2>}
        <div className="text-center text-gray-500">
          <p>No team data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full p-8">
      {title && <h2 className="text-xl font-bold mb-4">{title}</h2>}

      <div className="w-full max-w-6xl">
        <div className="grid grid-cols-3 gap-8">
          {teamData.members.map((member, index) => (
            <div key={index} className="text-center">
              <img
                src={member.image || "/placeholder-avatar.png"}
                alt={member.name || "Team member"}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">
                {member.name || "Unknown"}
              </h3>
              <p className="text-lg text-gray-600 mb-2">
                {member.role || "Role not specified"}
              </p>
              {member.bio && (
                <p className="text-sm text-gray-500">{member.bio}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
