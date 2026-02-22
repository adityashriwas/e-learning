import { ChartNoAxesColumn, SquareLibrary } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";
import { Link, Outlet } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <div className="hidden lg:block w-[250px] sm:w-[300px] space-y-8 border-r border-gray-300 dark:border-gray-700  p-5 sticky top-0  h-screen">
        <div className="space-y-4 ">
          <Link to="dashboard" className="flex items-center gap-2">
            <ChartNoAxesColumn size={22} />
            <h1>Dashboard</h1>
          </Link>
          <Link to="course" className="flex items-center gap-2">
            <SquareLibrary size={22} />
            <h1>Courses</h1>
          </Link>
        </div>
      </div>
      <div className="flex-1 px-4 py-6 md:px-8 md:py-8 lg:p-10">
        <div className="lg:hidden mb-6 flex items-center gap-2 overflow-x-auto">
          <Link to="dashboard">
            <Button variant="outline" size="sm" className="whitespace-nowrap">
              <ChartNoAxesColumn size={16} className="mr-2" />
              Dashboard
            </Button>
          </Link>
          <Link to="course">
            <Button variant="outline" size="sm" className="whitespace-nowrap">
              <SquareLibrary size={16} className="mr-2" />
              Courses
            </Button>
          </Link>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default Sidebar;
