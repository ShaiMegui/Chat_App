import { useAppStore } from "@/store";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { colors, getColor } from "@/lib/utils";
import { FaPlus, FaTrash } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import apiClient from "@/lib/api-client";
import {
  HOST,
  REMOVE_PROFIL_IMAGE,
  UPDATE_IMAGE_PROFIL_ROUTE,
  UPDATE_PROFIL_ROUTE,
} from "@/utils/constants";

const Profil = () => {
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useAppStore();
  const [firstName, setfirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [image, setImage] = useState(null);
  const [hovered, setHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState(0);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (userInfo.profilSetup) {
      setfirstName(userInfo.firstName);
      setLastName(userInfo.lastName);
      setSelectedColor(userInfo.color);
    }
    if(userInfo.image){
      setImage(`${HOST}/${userInfo.image}`);
    }
  }, [userInfo]);

  const validateProfil = () => {
    if (!firstName) {
      toast.error("First Name is required.");
      return false;
    }
    if (!lastName) {
      toast.error("Last Name is required.");
      return false;
    }
    return true;
  };

  const saveChanges = async () => {
    if (validateProfil()) {
      try {
        const res = await apiClient.post(
          UPDATE_PROFIL_ROUTE,
          { firstName, lastName, color: selectedColor },
          { withCredentials: true }
        );
        if (res.status === 200 && res.data) {
          setUserInfo({ ...res.data });
          toast.success("Profile updated successfully");
          navigate("/chat");
        }
      } catch (error) {
        console.error("Error saving profile:", error);
      }
    }
  };

  const handleFileInputClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("profil-image", file);

      try {
        const res = await apiClient.post(UPDATE_IMAGE_PROFIL_ROUTE, formData, {
          withCredentials: true,
        });
        if (res.status === 200 && res.data.image) {
          setUserInfo({ ...userInfo, image: res.data.image });
          toast.success("Image updated successfully.");
        }

        const reader = new FileReader();
        reader.onload = () => {
          setImage(reader.result);
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error("Error updating image:", error);
        toast.error("Image update failed. Please try again.");
      }
    }
  };

  const handleDeleteImage = async () => {
    try {
      const res = await apiClient.delete(REMOVE_PROFIL_IMAGE, {
        withCredentials: true,
      });
      if (res.status === 200) {
        setUserInfo({ ...userInfo, image: null });
        toast.success("Image removed successfully.");
        setImage(null)
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error("Image removal failed. Please try again.");
    }
  };

  return (
    <div className="bg-[#1b1c25] h-[100vh] flex items-center justify-center flex-col gap-10">
      <div className="flex flex-col gap-10 w-[80vw] md:w-max">
        <div onClick={() => navigate("/chat")}>
          <IoArrowBack className="text-4xl lg:text-6xl text-white/90 cursor-pointer" />
        </div>
        <div className="grid grid-cols-2">
          <div
            className="h-full w-32 md:w-48 md:h-48 relative flex items-center justify-center"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <Avatar className="h-32 w-32 md:w-48 md:h-48 rounded-full overflow-hidden">
              {image ? (
                <AvatarImage
                  src={image}
                  alt="profile"
                  className="object-cover w-full h-full bg-black"
                />
              ) : (
                <div
                  className={`uppercase h-32 w-32 md:w-48 md:h-48 text-5xl border-[1px] flex items-center justify-center rounded-full ${getColor(
                    selectedColor
                  )}`}
                >
                  {firstName
                    ? firstName.split("").shift()
                    : userInfo.email.split("").shift()}
                </div>
              )}
            </Avatar>
            {hovered && (
              <div
                className="absolute inset-0 flex items-center justify-center bg-black/50 ring-fuchsia-50 rounded-full"
                onClick={image ? handleDeleteImage : handleFileInputClick}
              >
                {image ? (
                  <FaTrash className="text-white text-3xl cursor-pointer" />
                ) : (
                  <FaPlus className="text-white text-3xl cursor-pointer" />
                )}
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleImageChange}
              name="profil-image"
              accept=".png, .jpg, .jpeg, .svg, .webp"
            />
          </div>
          <div className="flex min-w-32 md:min-w-64 flex-col gap-5 text-white items-center justify-center">
            <div className="w-full">
              <Input
                placeholder="Email"
                type="email"
                disabled
                value={userInfo.email}
                className="rounded-lg p-6 bg-[#2c2e3b] border-none"
              />
            </div>
            <div className="w-full">
              <Input
                placeholder="First Name"
                type="text"
                onChange={(e) => setfirstName(e.target.value)}
                value={firstName}
                className="rounded-lg p-6 bg-[#2c2e3b] border-none"
              />
            </div>
            <div className="w-full">
              <Input
                placeholder="Last Name"
                type="text"
                onChange={(e) => setLastName(e.target.value)}
                value={lastName}
                className="rounded-lg p-6 bg-[#2c2e3b] border-none"
              />
            </div>
            <div className="w-full flex gap-5">
              {colors.map((color, index) => (
                <div
                  className={`${color} h-8 w-8 rounded-full cursor-pointer transition-all duration-300 
                  ${
                    selectedColor === index
                      ? "outline outline-white/50 outline-1"
                      : ""
                  }`}
                  key={index}
                  onClick={() => setSelectedColor(index)}
                ></div>
              ))}
            </div>
          </div>
        </div>
        <div className="w-full">
          <Button
            className="h-16 w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300"
            onClick={saveChanges}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profil;
