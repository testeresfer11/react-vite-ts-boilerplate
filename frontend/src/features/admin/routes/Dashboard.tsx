import ContentWrapper from "@/components/Layout/AdminLayout/ContentWrapper";
import { TotalRevenue } from "./DashboardComponents/TotalRevenue";
import { NewUsers } from "./DashboardComponents/NewUsers";
import { TotalSessions } from "./DashboardComponents/TotalSessions";
import LatestUsersTable from "./DashboardComponents/LatestUsersTable";

export const Dashboard = () => {
  return (
    <ContentWrapper title="Dashboard">
      <div className="dashboard-main">
        <div className="row">
          <div className="col-12 col-md-6 col-lg-3 mb-3">
            <div className="dashboard-col cardbg p-4 rounded-lg">
              <p className="f-14 lighttxt  d-flex align-items-center gap-2">
                <i className="fa-solid fa-user"></i> Total users
              </p>
              <h3 className="mb-0 d-flex align-items-end gap-2 justify-content-start">
                <span className="f-24 semi-bold text-white">23.6K </span>
                <span className="user-down d-flex align-items-center gap-2">
                  12.6% <i className="fa-solid fa-arrow-right"></i>
                </span>
              </h3>
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-3 mb-3">
            <div className="dashboard-col cardbg p-4 rounded-lg">
              <p className="f-14 lighttxt  d-flex align-items-center gap-2">
                <i className="fa-solid fa-star"></i> Subscriptions
              </p>
              <h3 className="mb-0 d-flex align-items-end gap-2 justify-content-start">
                <span className="f-24 semi-bold text-white">2.6K </span>
                <span className="user-down up d-flex align-items-center gap-2">
                  12.6% <i className="fa-solid fa-arrow-right"></i>
                </span>
              </h3>
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-3 mb-3">
            <div className="dashboard-col cardbg p-4 rounded-lg">
              <p className="f-14 lighttxt  d-flex align-items-center gap-2">
                <i className="fa-solid fa-eye"></i> Generated Codes
              </p>
              <h3 className="mb-0 d-flex align-items-end gap-2 justify-content-start">
                <span className="f-24 semi-bold text-white">50.8K </span>
                <span className="user-down up d-flex align-items-center gap-2">
                  12.6% <i className="fa-solid fa-arrow-right"></i>
                </span>
              </h3>
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-3 mb-3">
            <div className="dashboard-col cardbg p-4 rounded-lg">
              <p className="f-14 lighttxt  d-flex align-items-center gap-2">
                <i className="fa-solid fa-circle-plus"></i> New sign ups
              </p>
              <h3 className="mb-0 d-flex align-items-end gap-2 justify-content-start">
                <span className="f-24 semi-bold text-white">765</span>
                <span className="user-down up d-flex align-items-center gap-2">
                  12.6% <i className="fa-solid fa-arrow-right"></i>
                </span>
              </h3>
            </div>
          </div>
        </div>
        <div className="card-dash dashboard-col cardbg rounded-lg mb-4">
          <div className="row">
            <div className="col-12 col-md-7 p-0">
              <div className="chart-cards  border-rght p-4 ">
                <p className="f-14 lighttxt">Total revenue</p>
                <h3 className="mb-0 d-flex align-items-end gap-2 justify-content-start">
                  <span className="f-24 semi-bold text-white">23.6K </span>
                  <span className="user-down d-flex align-items-center gap-2">
                    12.6% <i className="fa-solid fa-arrow-right"></i>
                  </span>
                </h3>
                <TotalRevenue />
              </div>
            </div>
            <div className="col-12 col-md-5 p-0">
              <div className="border-btm">
                <div className="chart-cards p-4   new-users">
                  <p className="f-14 lighttxt">Total New Users</p>
                  <h3 className="mb-0 d-flex align-items-end gap-2 justify-content-start">
                    <span className="f-24 semi-bold text-white">23.6K </span>
                    <span className="user-down d-flex align-items-center gap-2">
                      12.6% <i className="fa-solid fa-arrow-right"></i>
                    </span>
                  </h3>
                  <NewUsers />
                </div>
              </div>
              <div className="chart-cards p-4 new-users">
                <p className="f-14 lighttxt">Total sessions</p>
                <h3 className="mb-0 d-flex align-items-end gap-2 justify-content-start">
                  <span className="f-24 semi-bold text-white">23.6K </span>
                  <span className="user-down d-flex align-items-center gap-2">
                    12.6% <i className="fa-solid fa-arrow-right"></i>
                  </span>
                </h3>
                <TotalSessions />
              </div>
            </div>
          </div>
        </div>
        <div className="dash-table dashboard-col cardbg  rounded-lg">
          <LatestUsersTable />
        </div>
      </div>
    </ContentWrapper>
  );
};
