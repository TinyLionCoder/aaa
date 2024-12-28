import React, { useState } from "react";
import styles from "../css_modules/TokenListingStyles.module.css";

export const TokenListing: React.FC = () => {
  const [formData, setFormData] = useState({
    tokenName: "",
    vestigeLink: "",
    xLink: "",
    image: null as File | null,
    transactionId: "", // New field for Algorand payment transaction ID
  });
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type === "image/png") {
        setFormData({ ...formData, image: file });
        setPreview(URL.createObjectURL(file));
        setError("");
      } else {
        setError("Only PNG images are allowed.");
        setFormData({ ...formData, image: null });
        setPreview(null);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.tokenName ||
      !formData.vestigeLink ||
      !formData.xLink ||
      !formData.image ||
      !formData.transactionId
    ) {
      setError("All fields are required.");
      return;
    }
    setError("");
    // Handle form submission logic here
    console.log("Form Data Submitted:", formData);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Coming Soon!</h1>
      <h2 className={styles.heading}>Token Listing</h2>
      <p className={styles.instructions}>
        Please provide all the necessary details for your token listing,
        including the Algorand payment transaction ID for a fee of $250 sent to
        wallet{" "}
        <strong>
          HE7225SD6ZKYO45QWYCE4BZ3ITFEK7WI7XGMAVAMB56FZREJVPMHNRSL2E
        </strong>
        .
      </p>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="tokenName" className={styles.label}>
            Token Name
          </label>
          <input
            id="tokenName"
            name="tokenName"
            type="text"
            className={styles.input}
            value={formData.tokenName}
            onChange={handleInputChange}
            placeholder="Enter the token name"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="vestigeLink" className={styles.label}>
            Vestige Link
          </label>
          <input
            id="vestigeLink"
            name="vestigeLink"
            type="url"
            className={styles.input}
            value={formData.vestigeLink}
            onChange={handleInputChange}
            placeholder="Enter the Vestige link"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="xLink" className={styles.label}>
            X Link
          </label>
          <input
            id="xLink"
            name="xLink"
            type="url"
            className={styles.input}
            value={formData.xLink}
            onChange={handleInputChange}
            placeholder="Enter the X (Twitter) link"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="transactionId" className={styles.label}>
            Algorand Payment Transaction ID
          </label>
          <input
            id="transactionId"
            name="transactionId"
            type="text"
            className={styles.input}
            value={formData.transactionId}
            onChange={handleInputChange}
            placeholder="Enter the Algorand transaction ID"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="image" className={styles.label}>
            Token Logo (PNG only)
          </label>
          <input
            id="image"
            name="image"
            type="file"
            accept="image/png"
            className={styles.input}
            onChange={handleFileChange}
            required
          />
          {preview && (
            <div className={styles.preview}>
              <img
                src={preview}
                alt="Token Preview"
                className={styles.previewImage}
              />
            </div>
          )}
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <button type="submit" disabled={true} className={styles.submitButton}>
          Submit Listing
        </button>
      </form>
    </div>
  );
};
