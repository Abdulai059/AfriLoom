// components/profile/menuData.ts
import { Feather, Ionicons } from "@expo/vector-icons";

export type UserRole = "buyer" | "creator";

export const getProfileMenu = (role: UserRole = "buyer") => {
  const commonAccount = [
    {
      icon: <Ionicons name="person-outline" size={20} color="#64748b" />,
      title: "Edit Profile",
      route: "/Account/update-profile",
    },
    {
      icon: <Ionicons name="notifications-outline" size={20} color="#64748b" />,
      title: "Notifications",
      route: "/notifications",
    },
    {
      icon: <Feather name="lock" size={20} color="#64748b" />,
      title: "Change Password",
      route: "/Account/change-password",
    },
    {
      icon: <Feather name="user-plus" size={20} color="#64748b" />,
      title: "Invite Friends",
      route: "/invite",
    },
    {
      icon: <Feather name="globe" size={20} color="#64748b" />,
      title: "Language",
      route: "/language",
    },
  ];

  // Creator-only items
  const creatorItems = [
    {
      icon: (
        <Ionicons name="shield-checkmark-outline" size={20} color="#64748b" />
      ),
      title: "Verify Identity",
      route: "/Account/verify-identity",
      badge: "Required", // optional
    },
    {
      icon: <Feather name="credit-card" size={20} color="#64748b" />,
      title: "Payment Methods",
      route: "/payment-methods",
    },
  ];

  const accountItems =
    role === "creator" ? [...commonAccount, ...creatorItems] : commonAccount;

  return [
    {
      title: "Account",
      items: accountItems,
    },
    {
      title: "Support",
      items: [
        {
          icon: <Feather name="file-text" size={20} color="#64748b" />,
          title: "Terms And Conditions",
          route: "/terms",
        },
        {
          icon: <Feather name="shield" size={20} color="#64748b" />,
          title: "Privacy Policy",
          route: "/privacy",
        },
        {
          icon: <Feather name="message-circle" size={20} color="#64748b" />,
          title: "Contact Us",
          route: "/contact",
        },
      ],
    },
  ];
};
