"use client";
import * as excalidrawLib from "@excalidraw/excalidraw";
import { Excalidraw } from "@excalidraw/excalidraw";

import "@excalidraw/excalidraw/index.css";
import ExampleApp from "./ExampleApp";

const ExcalidrawWrapper: React.FC = () => {
  return (
    <>
      <ExampleApp
        appTitle={"Excalidraw with Nextjs Example"}
        useCustom={(api: any, args?: any[]) => {}}
        excalidrawLib={excalidrawLib}
      >
        <Excalidraw />
      </ExampleApp>
    </>
  );
};

export default ExcalidrawWrapper;