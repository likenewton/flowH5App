package cn.yunovo.iov.flowh5appservices;

import com.github.ore.boot.bootstrap.starter.AbsBootStarter;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

/**
 * @author bill
 * @date 2020/5/9 15:59
 * @since 1.0
 */
@SpringBootApplication
@EnableDiscoveryClient
public class BootStarter extends AbsBootStarter {

    @Override
    public void run(String[] args) {
        SpringApplication.run(BootStarter.class, args);
    }

    public static void main(String[] args) {
        BootStarter starter = new BootStarter();
        starter.run(args);
    }

}

