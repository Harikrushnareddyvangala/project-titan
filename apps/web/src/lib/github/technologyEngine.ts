export interface TechnologyStack {
  frontend: string;
  backend: string;
  aiFramework: string;
  database: string;
  vectorDatabase: string;
  cloud: string;
  packageManager: string;
}

interface BuildTechnologyStackInput {
  description: string;
  topics: string[];
  languages: string[];
}

export function buildTechnologyStack({
  description,
  topics,
  languages,
}: BuildTechnologyStackInput): TechnologyStack {

  const desc = description.toLowerCase();

  const topicString = topics.join(" ").toLowerCase();

  const lang = languages.map(l => l.toLowerCase());

  let frontend = "Unknown";
  let backend = "Unknown";
  let aiFramework = "None";
  let database = "Unknown";
  let vectorDatabase = "None";
  let cloud = "Unknown";
  let packageManager = "Unknown";

  //-----------------------
  // Frontend
  //-----------------------

  if (
    desc.includes("next") ||
    topicString.includes("nextjs")
  ) {
    frontend = "Next.js";
  } else if (
    lang.includes("typescript") ||
    lang.includes("javascript")
  ) {
    frontend = "React";
  }

  if (desc.includes("vue")) frontend = "Vue";

  if (desc.includes("angular")) frontend = "Angular";

  //-----------------------
  // Backend
  //-----------------------

  if (desc.includes("fastapi")) backend = "FastAPI";

  else if (desc.includes("django")) backend = "Django";

  else if (desc.includes("flask")) backend = "Flask";

  else if (desc.includes("spring")) backend = "Spring Boot";

  else if (desc.includes("express")) backend = "Express";

  else if (lang.includes("python")) backend = "Python";

  //-----------------------
  // AI
  //-----------------------

  if (desc.includes("langchain")) {

    aiFramework = "LangChain";

  }

  else if (desc.includes("llamaindex")) {

    aiFramework = "LlamaIndex";

  }

  else if (desc.includes("huggingface")) {

    aiFramework = "Hugging Face";

  }

  else if (desc.includes("openai")) {

    aiFramework = "OpenAI";

  }

  else if (desc.includes("gemini")) {

    aiFramework = "Gemini";

  }

  //-----------------------
  // Database
  //-----------------------

  if (desc.includes("postgres")) database = "PostgreSQL";

  else if (desc.includes("mysql")) database = "MySQL";

  else if (desc.includes("mongodb")) database = "MongoDB";

  else if (desc.includes("sqlite")) database = "SQLite";

  else if (desc.includes("redis")) database = "Redis";

  //-----------------------
  // Vector Database
  //-----------------------

  if (desc.includes("pinecone")) {

    vectorDatabase = "Pinecone";

  }

  else if (desc.includes("qdrant")) {

    vectorDatabase = "Qdrant";

  }

  else if (desc.includes("chromadb")) {

    vectorDatabase = "ChromaDB";

  }

  else if (desc.includes("milvus")) {

    vectorDatabase = "Milvus";

  }

  else if (desc.includes("weaviate")) {

    vectorDatabase = "Weaviate";

  }

  //-----------------------
  // Cloud
  //-----------------------

  if (desc.includes("aws")) cloud = "AWS";

  if (desc.includes("azure")) cloud = "Azure";

  if (desc.includes("gcp")) cloud = "Google Cloud";

  //-----------------------
  // Package Manager
  //-----------------------

  if (frontend === "Next.js") {

    packageManager = "pnpm / npm";

  }

  if (backend === "Python") {

    packageManager = "pip";

  }

  return {

    frontend,

    backend,

    aiFramework,

    database,

    vectorDatabase,

    cloud,

    packageManager,

  };

}