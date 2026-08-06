"use client";

import { useState } from "react";


const skills = {
  "Data Science": ["Python", "Pandas", "Scikit-learn", "NumPy", "Matplotlib", "Seaborn", "Plotly", "Statsmodels", "SciPy", "Jupyter Notebook", "Google Colab", "R", "RStudio", "tidyverse", "ggplot2", "caret", "shiny", "SQL", "PostgreSQL", "MySQL", "MongoDB", "SQLite", "ETL", "Data Cleaning", "Data Wrangling", "Data Visualization", "Exploratory Data Analysis (EDA)", "Feature Engineering", "Model Evaluation", "Cross-Validation", "Hyperparameter Tuning", "Time Series Analysis", "Natural Language Processing (NLP)", "Deep Learning"],
  "Machine Learning": ["Regression", "Classification", "XGBoost", "LightGBM", "CatBoost", "TensorFlow", "PyTorch", "Keras", "Convolutional Neural Networks (CNNs)", "Recurrent Neural Networks (RNNs)", "Long Short-Term Memory (LSTM)", "Generative Adversarial Networks (GANs)", "Autoencoders", "Transfer Learning", "Reinforcement Learning", "Unsupervised Learning", "Clustering", "Dimensionality Reduction", "Principal Component Analysis (PCA)", "t-SNE", "UMAP", "Anomaly Detection", "Recommendation Systems", "Ensemble Methods", "Bagging", "Boosting", "Stacking"],
  "AI & LLMs": ["OpenAI APIs", "Prompt Engineering", "RAG", "LangChain", "Hugging Face", "Transformers", "BERT", "GPT", "T5", "RoBERTa", "XLNet", "ALBERT", "DistilBERT", "OpenAI Codex", "OpenAI DALL-E", "OpenAI CLIP", "OpenAI Whisper", "OpenAI Gym", "OpenAI Spinning Up"],
  "BI Tools": ["Power BI", "Tableau", "SQL", "Excel", "Google Data Studio", "Looker", "Metabase", "Superset"],
  "Cloud & DevOps": ["AWS", "Azure", "Google Cloud Platform (GCP)", "Docker", "Kubernetes", "Terraform", "CI/CD", "Git", "GitHub", "GitLab", "Jenkins", "Ansible", "Puppet", "Chef"],
  "Programming & Scripting": ["Python", "R", "SQL", "JavaScript","TypeScript", "Bash", "Shell Scripting", "MATLAB", "Julia"],
  "Big Data & Streaming": ["Apache Hadoop", "Apache Spark", "Apache Kafka", "Apache Flink", "Apache Storm", "Google BigQuery", "Amazon Redshift", "Snowflake"],
  "Data Engineering": ["ETL Pipelines", "Data Warehousing", "Data Lakes", "Data Modeling", "Airflow", "Luigi", "Prefect"],
  "Version Control & Collaboration": ["Git", "GitHub", "GitLab", "Bitbucket", "JIRA", "Confluence", "Slack"],
  "Soft Skills": ["Communication", "Teamwork", "Problem-Solving", "Critical Thinking", "Adaptability", "Time Management", "Leadership", "Creativity", "Collaboration", "Presentation Skills"],
  "Project Management": ["Agile", "Scrum", "Kanban", "Waterfall", "Project Planning", "Risk Management", "Stakeholder Management", "Resource Allocation", "Budgeting", "Scheduling"],
  "Data Privacy & Security": ["GDPR", "HIPAA", "Data Encryption", "Access Control", "Data Anonymization", "Data Masking", "Secure Data Storage", "Network Security", "Vulnerability Assessment", "Penetration Testing"],
  "Ethics & Responsible AI": ["Bias Mitigation", "Fairness in AI", "Transparency", "Explainable AI (XAI)", "Accountability", "Ethical Decision-Making", "Responsible Data Collection", "Data Governance", "AI Policy and Regulation"],
  "Research & Development": ["Literature Review", "Experimental Design", "Hypothesis Testing", "Statistical Analysis", "Data Collection Methods", "Survey Design", "Qualitative Research", "Quantitative Research", "Mixed Methods Research", "Research Ethics"],
  "Communication & Presentation": ["Data Storytelling", "Data Visualization", "Report Writing", "Technical Writing", "Public Speaking", "Presentation Design", "Infographics", "Dashboards", "Executive Summaries", "Stakeholder Communication"],
};

export function AboutSkills() {
  const categories = Object.keys(skills);

  const [selected, setSelected] = useState(categories[0]);

  return (
    <div>
      <div className="mb-10">
        <span className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-300">
          Skills
        </span>

        <h3 className="mt-4 text-3xl font-bold text-white">
          Engineering Expertise
        </h3>

        <p className="mt-4 max-w-xl leading-8 text-zinc-400">
          Rather than listing every technology, explore the
          domains where I build production-grade solutions.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">

        {/* Categories */}

        <div className="space-y-3">

          {categories.map((category) => (

            <button
              key={category}
              onClick={() => setSelected(category)}
              className={`
                w-full
                rounded-2xl
                border
                px-5
                py-4
                text-left
                transition-all
                ${
                  selected === category
                    ? "border-cyan-400 bg-cyan-500/20 text-white"
                    : "border-white/10 bg-white/5 text-zinc-400 hover:border-cyan-500/40"
                }
              `}
            >
              {category}
            </button>

          ))}

        </div>

        {/* Skills */}

        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">

          <h4 className="text-2xl font-bold text-white">
            {selected}
          </h4>

          <div className="mt-8 flex flex-wrap gap-3">

            {skills[selected as keyof typeof skills].map((skill) => (

              <span
                key={skill}
                className="
                  rounded-full
                  border
                  border-cyan-500/20
                  bg-cyan-500/10
                  px-4
                  py-2
                  text-sm
                  font-medium
                  text-cyan-300
                  transition
                  hover:border-cyan-400
                  hover:bg-cyan-500/20
                "
              >
                {skill}
              </span>

            ))}

          </div>

        </div>

      </div>
    </div>
  );
}