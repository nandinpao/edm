FROM ghcr.io/graalvm/jdk-community:21

RUN mkdir -p /usr/agitg
RUN mkdir -p /config
RUN mkdir -p /usr/agitg/data/upload

COPY ./config/ /config
COPY app.jar /usr/agitg/app.jar

WORKDIR /usr/agitg

CMD ["java", "-jar", "-Xms256m", "-Xmx1024m", "-Dserver.port=80", "-Dspring.config.location=/config/application.yml", "-Dcom.agitg.mailapi.config=/config", "-Dlogging.config=/config/logback.xml", "app.jar" ]