"use client";

import * as React from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { CopyButton } from "./copy-button";

interface JsonViewerProps {
  data: unknown;
  className?: string;
  defaultExpanded?: boolean;
  maxDepth?: number;
  showCopy?: boolean;
}

interface JsonNodeProps {
  name?: string;
  value: unknown;
  depth: number;
  maxDepth: number;
  defaultExpanded: boolean;
}

function JsonNode({
  name,
  value,
  depth,
  maxDepth,
  defaultExpanded,
}: JsonNodeProps) {
  const [isExpanded, setIsExpanded] = React.useState(
    defaultExpanded && depth < maxDepth
  );

  const type = Array.isArray(value)
    ? "array"
    : value === null
      ? "null"
      : typeof value;

  const isExpandable =
    type === "object" || (type === "array" && (value as unknown[]).length > 0);

  const toggleExpand = () => {
    if (isExpandable) {
      setIsExpanded(!isExpanded);
    }
  };

  const renderValue = () => {
    switch (type) {
      case "string":
        return (
          <span className="text-green-400">
            &quot;{String(value)}&quot;
          </span>
        );
      case "number":
        return <span className="text-blue-400">{String(value)}</span>;
      case "boolean":
        return (
          <span className="text-yellow-400">{value ? "true" : "false"}</span>
        );
      case "null":
        return <span className="text-gray-500">null</span>;
      case "undefined":
        return <span className="text-gray-500">undefined</span>;
      case "array": {
        const arr = value as unknown[];
        if (arr.length === 0) {
          return <span className="text-gray-400">[]</span>;
        }
        if (!isExpanded) {
          return (
            <span className="text-gray-400">
              Array({arr.length})
            </span>
          );
        }
        return (
          <div className="ml-4">
            {arr.map((item, index) => (
              <JsonNode
                key={index}
                name={String(index)}
                value={item}
                depth={depth + 1}
                maxDepth={maxDepth}
                defaultExpanded={defaultExpanded}
              />
            ))}
          </div>
        );
      }
      case "object": {
        const obj = value as Record<string, unknown>;
        const keys = Object.keys(obj);
        if (keys.length === 0) {
          return <span className="text-gray-400">{"{}"}</span>;
        }
        if (!isExpanded) {
          return (
            <span className="text-gray-400">
              {"{"}...{"}"}
            </span>
          );
        }
        return (
          <div className="ml-4">
            {keys.map((key) => (
              <JsonNode
                key={key}
                name={key}
                value={obj[key]}
                depth={depth + 1}
                maxDepth={maxDepth}
                defaultExpanded={defaultExpanded}
              />
            ))}
          </div>
        );
      }
      default:
        return <span>{String(value)}</span>;
    }
  };

  return (
    <div className="font-mono text-xs leading-relaxed">
      <div className="flex items-start gap-1">
        {isExpandable ? (
          <button
            onClick={toggleExpand}
            className="p-0.5 -ml-4 hover:bg-muted rounded flex-shrink-0"
          >
            {isExpanded ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
          </button>
        ) : (
          <span className="w-4 flex-shrink-0" />
        )}
        {name !== undefined && (
          <>
            <span className="text-purple-400">{name}</span>
            <span className="text-gray-400">: </span>
          </>
        )}
        {renderValue()}
      </div>
    </div>
  );
}

export function JsonViewer({
  data,
  className,
  defaultExpanded = true,
  maxDepth = 5,
  showCopy = true,
}: JsonViewerProps) {
  return (
    <div className={cn("relative", className)}>
      {showCopy && (
        <div className="absolute right-2 top-2 z-10">
          <CopyButton value={JSON.stringify(data, null, 2)} />
        </div>
      )}
      <div className="p-4 overflow-auto bg-muted/50 rounded-lg">
        <div className="pl-4">
          <JsonNode
            value={data}
            depth={0}
            maxDepth={maxDepth}
            defaultExpanded={defaultExpanded}
          />
        </div>
      </div>
    </div>
  );
}
