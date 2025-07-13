import React from "react";
import Preview from "../../../../assets/Preview.png"
import ProfileInfo from "./components/profile-info";

const ContactsContainer = () => {
  return (
    <div className="relative md:w-[35vw] lg:w-[30vw] xl:w-[20vw] bg-[#1b1c24] border-r-2 border-[#2f303b] w-full">
      <div className="pt-3">
        <Logo />
      </div>
      <div className="my-5 ">
        <div className="flex items-center justify-between pr-10">
          <Title text="Direct Messages"/>
        </div>
      </div>
      <div className="my-5 ">
        <div className="flex items-center justify-between pr-10">
          <Title text="Channels"/>
        </div>
      </div>
      <ProfileInfo /> 
    </div>
  );
};

export default ContactsContainer;

const Logo = () => {
  return (
    <div className="flex p-5 justify-start items-center gap-2">
      <img src={Preview} alt="" />
    </div>
  );
};

const Title = ({ text }) => {
  return (
    <h6 className="uppercase tracking-widest text-neutral-400 pl-10 font-light text-opacity-90 text-sm">
      {text}
    </h6>
  );
};
