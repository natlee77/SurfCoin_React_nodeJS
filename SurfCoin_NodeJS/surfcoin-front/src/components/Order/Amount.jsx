function  Amount({ updateAmount }) {
  const handleChange = (e) => {
    updateAmount(+((e.target.value).replaceAll(' ', '')));   
  };

  return (
    <div>
      <input
        className="data"
        type="text"
        name="text"
        placeholder=" Write amount ."
        onChange={handleChange}
      />
    </div>
  );
}

export default Amount;
