import { notFound } from "next/navigation";
import Image from "next/image";
import serverComponentFetchRequest from "@/services/serverComponentFetchRequest";
import { QuestionResponsePayloadModel } from "@/models/question/particular/QuestionResponsePayloadModel";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm"; // For GitHub Flavored Markdown
import rehypeSanitize from "rehype-sanitize"; // For sanitizing HTML

interface ViewQuestionPageProps {
  params: {
    id: string;
  };
}

const ViewQuestionPage: React.FC<ViewQuestionPageProps> = async ({ params }) => {
  const { id } = params;

  // Fetch the question data from the backend API
  const res = await serverComponentFetchRequest(`questions/${id}`, {
    cache: "no-store",
  });

  if ("error" in res) {
    // Handle not found or error responses
    return notFound();
  }

  const question: QuestionResponsePayloadModel = res.payload as QuestionResponsePayloadModel;

  // Fetch the file content to determine the Content-Type
  let contentType: string | null = null;
  let fileContent: string | null = null;

  try {
    const fileRes = await fetch(question.questionS3Url, {
      method: "GET",
      headers: {
        // Include any necessary headers, such as authentication tokens
      },
    });

    if (!fileRes.ok) {
      console.error("Failed to fetch file content:", fileRes.statusText);
      return notFound();
    }

    contentType = fileRes.headers.get("Content-Type");

    if (contentType && contentType.includes("markdown")) {
      fileContent = await fileRes.text();
    } else if (contentType && contentType.includes("text")) {
      fileContent = await fileRes.text();
    }
    // Handle other content types as needed
  } catch (error) {
    console.error("Error fetching file content:", error);
    return notFound();
  }

  // Determine the file type based on Content-Type
  const isPDF = contentType?.includes("pdf") ?? false;
  const isImage = contentType?.includes("image") ?? false;
  const isText = contentType?.includes("text") ?? false;
  const isMarkdown = contentType?.includes("markdown") ?? false;

  return (
    <div className="container mx-auto p-8 font-sans">
      <h1 className="text-3xl font-bold mb-4">{question.questionTitle}</h1>
      
      <div className="mb-6">
        <strong>Description:</strong> {question.questionDifficultyId} {/* Adjust as needed */}
      </div>
      
      <div className="mb-6">
        <strong>Tags:</strong> {question.tags.join(", ")}
      </div>
      
      <div className="mb-6">
        <strong>Companies:</strong>
        <ul className="list-disc list-inside">
          {question.companies.map((company) => (
            <li key={company.companyId}>
              Company ID: {company.companyId}, Frequency Asked: {company.frequencyAsked}, Last Asked: {" "}
              {company.lastAskedDate ? new Date(company.lastAskedDate).toLocaleString() : "N/A"}
            </li>
          ))}
        </ul>
      </div>
      
      <div>
        <strong>Question Content:</strong>
        <div className="mt-4">
          {isPDF ? (
            <iframe
              src={question.questionS3Url}
              width="100%"
              height="600px"
              title="Question Content"
              className="border-0"
            ></iframe>
          ) : isImage ? (
            <Image
              src={question.questionS3Url}
              alt={question.questionTitle}
              layout="responsive"
              width={700} // Adjust as needed
              height={400} // Adjust as needed
            />
          ) : isMarkdown && fileContent ? (
            <div className="prose">
              <ReactMarkdown
                // eslint-disable-next-line react/no-children-prop
                children={fileContent}
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeSanitize]}
              />
            </div>
          ) : isText && fileContent ? (
            <pre className="mt-4 p-4 bg-gray-100 rounded whitespace-pre-wrap">
              {fileContent}
            </pre>
          ) : (
            <a
              href={question.questionS3Url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              View Question Content
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewQuestionPage;