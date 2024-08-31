const WithTitleLayout = ({
  title,
  description,
  children,
}: Readonly<{
  title: string;
  description: string;
  children: React.ReactNode;
}>) => {
  return (
    <section className="pb-10 pt-8 lg:pb-20 lg:pt-12">
      <div className="-mx-4 flex flex-wrap">
        <div className="w-full px-4">
          <div className="mx-auto mb-6 max-w-[510px] text-center lg:mb-8">
            {/* <span className="mb-2 block text-lg font-semibold text-primary">
              Blog
            </span> */}
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl md:text-[40px]">
              {title}
            </h2>
            <p className="text-base text-body-color">{description}</p>
          </div>
        </div>
      </div>
      {children}
    </section>
  );
};

export default WithTitleLayout;
