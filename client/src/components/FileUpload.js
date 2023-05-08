import {useState} from "react";
import axios from "axios";
import "./FileUpload.css"
const FileUpload = ({contract, account, provider}) => {
    const [file,setFile]=useState(null);
    const [fileName,setFileName]=useState("No file selected")
    const handleSubmit=async(e)=>{
        e.preventDefault();
        // 2). Image file will reach here
        if(file){
            try{
                const formData = new FormData();
                formData.append("file",file);

                // 3). Image will be uploaded to Pinata(Ipfs)
                const resFile = await axios({
                    method: "post",
                    url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
                    data: formData,
                    headers: {
                      pinata_api_key: `7eb575ce2ba239102c46`, // Pinata API Key
                      pinata_secret_api_key: `f39e1815d91b660ff6eac1bd678d1e9e95dcada52da32154586d2e5563348219`, // Pinata Secret API Key
                      "Content-Type": "multipart/form-data",
                    },
                  });
                  // 4). Image hash attached with URL, sent to contract
                  const ImgHash = `ipfs://${resFile.data.IpfsHash}`;
                  //const signer = contract.connect(provider.getSigner());
                  const signer = contract.connect(provider.getSigner());
                  signer.add(account, ImgHash);
                } catch (e) {
                  alert("Unable to upload image to Pinata");
                }
              }
              alert("Successfully Image Uploaded");
              setFileName("No file selected");
              setFile(null);
            };
    // 1).Image will be retrieved (Fetch Data from Images)
    const retrieveFile=(e)=>{
        const data = e.target.files[0]; //Files of array of files object
        // console.log(data)
        const reader = new window.FileReader();
        reader.readAsArrayBuffer(data)
        reader.onloadend=()=>{
            setFile(e.target.files[0]);
        }
        setFileName(e.target.files[0].name);
        e.preventDefault();
    };
    return <div className="top">
        <form className="form" onSubmit={handleSubmit}>
            <label htmlFor="file-upload" className="choose">
                Choose File
            </label>
            <input disabled={!account} type="file" id="file-upload" name="data" onChange={retrieveFile}/>
            <span className="textArea">File: {fileName}</span>
            <button type="submit" className="upload" disabled={!file}>Upload File</button>
        </form>
    </div>;
};
export default FileUpload;


