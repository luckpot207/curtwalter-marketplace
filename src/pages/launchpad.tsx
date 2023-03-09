import { Link } from "react-router-dom";
import { Layout } from "../componentsV3/layout/Layout";
// import { useSelector } from "../../api/store";
import { useState } from "react";
import classNames from "classnames";

interface Inputs {
  projectName: string;
  description: string;
  team: string;
  supply: string;
  price: string;
  mintDate: string;
  youtube: string;
  twitter: string;
  facebook: string;
  linkedin: string;
  instagram: string;
}

export function LaunchPad(props: {

  loader: boolean;
}) {
  // const darkMode = useSelector((data) => data.darkMode);
  const darkMode = false;
  const [inputs, setInputs] = useState<Inputs>({ projectName: "", description: "", team: "", supply: "", price: "", mintDate: "", youtube: "", twitter: "", facebook: "", linkedin: "", instagram: "" });

  const handleChange = (event: any) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs(values => ({ ...values, [name]: value }))
  }

  const handleSubmit = (event: any) => {
    event.preventDefault();
    console.log(inputs);
  }

  return (

    <Layout footer={true}>
      <div className="container w-[50%] py-8 px-4 ml-[54px] flex justify-center">

        <div
          className={`w-full bg-gray-100 dark:bg-zinc-800 shadow-md rounded-3xl p-4  last:mr-0 flex ${darkMode ? "purple-border-hover" : "gray-border-hover"
            } ${props.loader ? "justify-center items-center" : ""}`}
        >
          {props.loader ? (
            <svg
              role="status"
              className="mr-2 w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
          ) : (
            <>
              <div className="w-full h-full flex items-center justify-center">
                <form onSubmit={handleSubmit} className="h-full flex-row items-center p-5 w-full px-5">
                  <div className="mb-10 font-medium text-center text-[15px]">
                    Apply for Launchpad
                  </div>
                  <div className="relative mb-4">
                    <p className="bg-white pt-0 pr-2 pb-0 pl-2 -mt-3 mr-0 mb-0 ml-2 font-medium text-gray-600 absolute">
                      Project Name
                    </p>
                    <input
                      type="text"
                      name="description"
                      className="border placeholder-gray-400 focus:outline-none 
                               w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 
                                text-base block bg-white border-gray-300 rounded-lg dark:bg-transparent "
                      value={inputs.projectName || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="relative mb-4">
                    <p className="bg-white pt-0 pr-2 pb-0 pl-2 -mt-3 mr-0 mb-0 ml-2 font-medium text-gray-600 absolute">
                      Description
                    </p>
                    <textarea
                      name="description"
                      required
                      rows={4}
                      className="block p-2.5 w-full text-sm bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-transparent "
                      value={inputs.description || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="relative mb-4">
                    <p className="bg-white pt-0 pr-2 pb-0 pl-2 -mt-3 mr-0 mb-0 ml-2 font-medium text-gray-600 absolute">
                      Team
                    </p>
                    <input
                      type="text"
                      name="team"
                      className="border placeholder-gray-400 focus:outline-none 
                               w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 
                                text-base block bg-white border-gray-300 rounded-lg dark:bg-transparent "
                      value={inputs.team || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="relative mb-4">
                    <p className="bg-white pt-0 pr-2 pb-0 pl-2 -mt-3 mr-0 mb-0 ml-2 font-medium text-gray-600 absolute">
                      Supply
                    </p>
                    <input
                      type="text"
                      name="supply"
                      className="border placeholder-gray-400 focus:outline-none 
                               w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 
                                text-base block bg-white border-gray-300 rounded-lg dark:bg-transparent "
                      value={inputs.supply || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="relative mb-4">
                    <p className="bg-white pt-0 pr-2 pb-0 pl-2 -mt-3 mr-0 mb-0 ml-2 font-medium text-gray-600 absolute">
                      Price
                    </p>
                    <input
                      type="text"
                      name="price"
                      className="border placeholder-gray-400 focus:outline-none 
                               w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 
                                text-base block bg-white border-gray-300 rounded-lg dark:bg-transparent "
                      value={inputs.price || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="relative mb-4">
                    <p className="bg-white pt-0 pr-2 pb-0 pl-2 -mt-3 mr-0 mb-0 ml-2 font-medium text-gray-600 absolute">
                      MintDate
                    </p>
                    <input
                      type="date"
                      name="mintDate"
                      className="border placeholder-gray-400 focus:outline-none 
                               w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 
                                text-base block bg-white border-gray-300 rounded-lg dark:bg-transparent "
                      // value={inputs.mintDate || (new Date()).toISOString().split('T')[0]}
                      defaultValue={(new Date()).toISOString().split('T')[0]}
                      min={(new Date()).toISOString().split('T')[0]} 
                      max="2030-01-01"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="relative mb-4">
                    <p className="bg-white pt-0 pr-2 pb-0 pl-2 -mt-3 mr-0 mb-0 ml-2 font-medium text-gray-600 absolute">
                      Youtube
                    </p>
                    <input
                      type="text"
                      name="youtube"
                      className="border placeholder-gray-400 focus:outline-none 
                               w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 
                                text-base block bg-white border-gray-300 rounded-lg dark:bg-transparent "
                      value={inputs.youtube || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="relative mb-4">
                    <p className="bg-white pt-0 pr-2 pb-0 pl-2 -mt-3 mr-0 mb-0 ml-2 font-medium text-gray-600 absolute">
                      Twitter
                    </p>
                    <input
                      type="text"
                      name="twitter"
                      className="border placeholder-gray-400 focus:outline-none 
                               w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 
                                text-base block bg-white border-gray-300 rounded-lg dark:bg-transparent "
                      value={inputs.twitter || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="relative mb-4">
                    <p className="bg-white pt-0 pr-2 pb-0 pl-2 -mt-3 mr-0 mb-0 ml-2 font-medium text-gray-600 absolute">
                      Facebook
                    </p>
                    <input
                      type="text"
                      name="facebook"
                      className="border placeholder-gray-400 focus:outline-none 
                               w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 
                                text-base block bg-white border-gray-300 rounded-lg dark:bg-transparent "
                      value={inputs.facebook || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="relative mb-4">
                    <p className="bg-white pt-0 pr-2 pb-0 pl-2 -mt-3 mr-0 mb-0 ml-2 font-medium text-gray-600 absolute">
                      Linkedin
                    </p>
                    <input
                      type="text"
                      name="linkedin"
                      className="border placeholder-gray-400 focus:outline-none 
                               w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 
                                text-base block bg-white border-gray-300 rounded-lg dark:bg-transparent "
                      value={inputs.linkedin || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="relative mb-4">
                    <p className="bg-white pt-0 pr-2 pb-0 pl-2 -mt-3 mr-0 mb-0 ml-2 font-medium text-gray-600 absolute">
                      Instagram
                    </p>
                    <input
                      type="text"
                      name="instagram"
                      className="border placeholder-gray-400 focus:outline-none 
                               w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 
                                text-base block bg-white border-gray-300 rounded-lg dark:bg-transparent "
                      value={inputs.instagram || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="flex justify-end ">
                    <input type="submit" className="group flex h-min w-fit items-center justify-center p-0.5 px-2 text-center font-medium focus:z-10 rounded-lg text-white bg-gray-600 border border-transparent hover:bg-gray-700 focus:ring-4 focus:ring-gray-100 disabled:hover:bg-gray-500 dark:bg-zinc-700 dark:hover:bg-zinc-600 dark:focus:ring-zinc-800 dark:border-zinc-600 dark:disabled:hover:bg-zinc-600" />
                  </div>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>

  );
}
