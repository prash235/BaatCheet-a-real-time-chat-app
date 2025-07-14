import React from "react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { FiEdit2 } from "react-icons/fi";
import { IoPowerSharp } from "react-icons/io5";
import { getColor } from "@/lib/utils";
import { useAppStore } from "@/store";
import { useNavigate } from "react-router-dom";
import { apiClient } from "@/lib/api-client";
import { LOG_OUT } from "@/utils/constants";
import { HOST } from "@/utils/constants";

const ProfileInfo = () => {
  const { userInfo, setUserInfo } = useAppStore();
  const navigate = useNavigate();

  const logOut = async () => {
    try {
        const response = await apiClient.post(LOG_OUT, {}, {withCredentials:true});
        if(response.status===200) {
            navigate("/auth");
            setUserInfo(null);
        }
    } catch (error) {
        console.log(error);
    }
  };

  return (
    <div className="absolute bottom-0 h-16 flex items-center justify-between px-10 w-full bg-[#2a2b33] ">
      <div className="flex gap-3 items-center justify-center">
        <div className="w-12 h-12 relative">
          <Avatar className="h-12 w-12 rounded-full overflow-hidden">
            {userInfo.image ? (
              <AvatarImage
                src={`${HOST}/${userInfo.image}`}
                alt="profile"
                className="object-cover w-full h-full"
              />
            ) : (
              <div
                className={`uppercase h-12 w-12 text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(
                  userInfo.color
                )}`}
              >
                {userInfo.firstName
                  ? userInfo.firstName.charAt(0)
                  : userInfo.email.charAt(0)}
              </div>
            )}
          </Avatar>
        </div>
        <div>
          {userInfo.firstName && userInfo.lastName
            ? `${userInfo.firstName} ${userInfo.lastName}`
            : ""}
        </div>
      </div>
      <div className="flex gap-5">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button type="button" className="focus:outline-none">
              <FiEdit2
                className="text-purple-500 text-xl font-medium"
                onClick={() => {
                  navigate("/profile");
                }}
              />
            </button>
          </TooltipTrigger>
          <TooltipContent
            className="bg-[#1c1b1e] border-none text-white"
            side="top"
            align="center"
          >
            Edit Profile
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button type="button" className="focus:outline-none">
                <IoPowerSharp
                  className="text-red-500 text-xl font-medium"
                  onClick={logOut}
                />
              </button>
            </TooltipTrigger>
            <TooltipContent
              className="bg-[#1c1b1e] border-none text-white"
              side="top"
              align="center"
            >
              Logout
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default ProfileInfo;
