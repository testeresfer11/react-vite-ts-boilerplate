import styled from "@emotion/styled";
import React from "react";
import logo from "@/assets/admin-logo.svg";

interface SidebarHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

const StyledSidebarHeader = styled.div`
  height: 64px;
  min-height: 64px;
  display: flex;
  align-items: center;
  padding: 0 20px;

  > div {
    width: 100%;
    overflow: hidden;
  }
`;

const StyledLogo = styled.div`
  width: 100%;
  min-height: 35px;
  display: flex;
  padding: 0px;
  align-items: center;
  background: #20203C;
  justify-content: center;
  border-radius: 8px;
  }
`;

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  children,
  ...rest
}) => {
  return (
    <StyledSidebarHeader {...rest}>
      <div className="sidebar-logo">
        <StyledLogo>
          <img src={logo} alt="Workflow" />
        </StyledLogo>
      </div>

    </StyledSidebarHeader>
  );
};
