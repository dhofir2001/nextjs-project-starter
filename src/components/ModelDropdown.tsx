"use client";

import { FC, useState } from "react";

interface ModelDropdownProps {
  selectedModel: string;
  onSelect: (model: string) => void;
}

// Default model is deepseek/deepseek-r1:free
const DEFAULT_MODEL = "deepseek/deepseek-r1:free";

const models = [
  "deepseek/deepseek-prover-v2:free",
  "tngtech/deepseek-r1t-chimera:free",
  "microsoft/mai-ds-r1:free",
  "deepseek/deepseek-v3-base:free",
  "deepseek/deepseek-chat-v3-0324:free",
  "deepseek/deepseek-r1-zero:free",
  "deepseek/deepseek-r1:free",
  "deepseek/deepseek-chat:free",
  "moonshotai/kimi-vl-a3b-thinking:free",
  "nvidia/llama-3.3-nemotron-super-49b-v1:free",
  "nvidia/llama-3.1-nemotron-ultra-253b-v1:free",
  "google/gemma-3-4b-it:free",
  "google/gemma-3-12b-it:free",
  "nousresearch/deephermes-3-llama-3-8b-preview:free",
  "qwen/qwen2.5-vl-72b-instruct:free",
  "meta-llama/llama-3.3-70b-instruct:free",
  "meta-llama/llama-3.2-11b-vision-instruct:free",
  "meta-llama/llama-3.1-8b-instruct:free",
  "meta-llama/llama-3.2-1b-instruct:free",
  "qwen/qwen3-4b:free",
  "meta-llama/llama-4-maverick:free",
  "mistralai/mistral-nemo:free",
  "agentica-org/deepcoder-14b-preview:free",
  "mistralai/mistral-small-3.1-24b-instruct:free",
  "google/gemma-3-27b-it:free",
  "qwen/qwen2.5-vl-3b-instruct:free",
  "deepseek/deepseek-r1-distill-qwen-14b:free",
  "qwen/qwen-2.5-vl-7b-instruct:free",
  "meta-llama/llama-3.1-405b:free",
  "qwen/qwen3-30b-a3b:free",
  "qwen/qwen3-8b:free",
  "qwen/qwen3-14b:free",
  "qwen/qwen3-32b:free",
  "qwen/qwen3-235b-a22b:free",
  "qwen/qwq-32b:free",
  "nousresearch/deephermes-3-mistral-24b-preview:free",
  "microsoft/phi-4-reasoning-plus:free",
  "microsoft/phi-4-reasoning:free",
  "thudm/glm-z1-32b:free",
  "thudm/glm-4-32b:free",
  "shisa-ai/shisa-v2-llama3.3-70b:free",
  "arliai/qwq-32b-arliai-rpr-v1:free",
  "bytedance-research/ui-tars-72b:free",
  "featherless/qwerky-72b:free",
  "open-r1/olympiccoder-32b:free",
  "google/gemma-3-1b-it:free",
  "rekaai/reka-flash-3:free",
  "cognitivecomputations/dolphin3.0-r1-mistral-24b:free",
  "cognitivecomputations/dolphin3.0-mistral-24b:free",
  "mistralai/mistral-small-24b-instruct-2501:free",
  "qwen/qwen-2.5-coder-32b-instruct:free",
  "qwen/qwen-2.5-7b-instruct:free",
  "qwen/qwen-2.5-72b-instruct:free",
  "mistralai/mistral-7b-instruct:free",
  "google/learnlm-1.5-pro-experimental:free",
  "qwen/qwen3-0.6b-04-28:free",
  "qwen/qwen3-1.7b:free",
  "opengvlab/internvl3-14b:free",
  "opengvlab/internvl3-2b:free",
  "thudm/glm-z1-9b:free",
  "thudm/glm-4-9b:free",
  "meta-llama/llama-3.2-3b-instruct:free",
  "qwen/qwq-32b-preview:free",
  "deepseek/deepseek-r1-distill-qwen-32b:free"
];

const ModelDropdown: FC<ModelDropdownProps> = ({ selectedModel, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [defaultModel, setDefaultModel] = useState(DEFAULT_MODEL);
  const [searchQuery, setSearchQuery] = useState("");

  const handleModelSelect = (model: string) => {
    onSelect(model);
    setIsOpen(false);
  };

  const handleSetDefault = () => {
    setDefaultModel(selectedModel);
    localStorage.setItem('defaultModel', selectedModel);
    setIsOpen(false);
  };

  const filteredModels = models.filter(model =>
    model.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex justify-between items-center w-[300px] rounded-lg border border-gray-700 shadow-sm px-4 py-2 bg-gray-800 text-sm font-medium text-white hover:bg-gray-700 focus:outline-none transition-colors"
      >
        <span className="truncate">{selectedModel}</span>
        <svg
          className="-mr-1 ml-2 h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-[300px] rounded-lg shadow-lg bg-gray-800 ring-1 ring-gray-700 focus:outline-none z-50">
          <div className="p-2 border-b border-gray-700">
            <input
              type="text"
              placeholder="Search models..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="py-1 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
            {filteredModels.map((model) => (
              <button
                key={model}
                onClick={() => handleModelSelect(model)}
                className={`block w-full text-left px-4 py-2 text-sm ${
                  model === selectedModel
                    ? "bg-gray-700 text-white"
                    : "text-gray-300 hover:bg-gray-700"
                } transition-colors`}
              >
                <span className="truncate block">{model}</span>
              </button>
            ))}
          </div>
          <div className="border-t border-gray-700 p-2">
            <button
              onClick={handleSetDefault}
              className="w-full text-center px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Set as Default
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModelDropdown;
